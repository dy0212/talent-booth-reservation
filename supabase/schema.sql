-- =========================================================
-- Talent Booth Reservation
-- Concurrent reservation protection
-- =========================================================


-- 예약 생성 함수
-- 같은 사용자의 동시 요청과 같은 회차의 동시 요청을 잠근 뒤
-- 시간 중복 및 정원을 검사하고 예약을 생성한다.

create or replace function public.create_reservation(
  p_session_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_session record;
  v_reserved_count bigint;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return jsonb_build_object(
      'success', false,
      'message', '로그인 후 예약할 수 있습니다.'
    );
  end if;


  -- 같은 사용자의 동시 예약 요청 방지
  perform 1
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', '사용자 정보를 찾을 수 없습니다.'
    );
  end if;


  -- 같은 회차의 동시 예약 요청 방지
  select
    s.id,
    s.start_time,
    s.end_time,
    s.capacity,
    s.reserved
  into v_session
  from public.sessions s
  where s.id = p_session_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', '회차를 찾을 수 없습니다.'
    );
  end if;


  -- 같은 회차 중복 예약 검사
  if exists (
    select 1
    from public.reservations r
    where r.user_id = v_user_id
      and r.session_id = p_session_id
  ) then
    return jsonb_build_object(
      'success', false,
      'message', '이미 예약한 회차입니다.'
    );
  end if;


  -- 기존 예약과 시간 중복 검사
  if exists (
    select 1
    from public.reservations r
    join public.sessions s
      on s.id = r.session_id
    where r.user_id = v_user_id
      and s.start_time < v_session.end_time
      and v_session.start_time < s.end_time
  ) then
    return jsonb_build_object(
      'success', false,
      'message', '이미 예약한 다른 부스와 시간이 겹칩니다.'
    );
  end if;


  -- 현재 실제 예약 수 계산
  select count(*)
  into v_reserved_count
  from public.reservations r
  where r.session_id = p_session_id;


  -- 예시 예약 인원 + 실제 예약 인원이 정원 이상인지 검사
  if v_session.reserved + v_reserved_count >= v_session.capacity then
    return jsonb_build_object(
      'success', false,
      'message', '해당 회차의 정원이 모두 찼습니다.'
    );
  end if;


  -- 예약 생성
  insert into public.reservations (
    user_id,
    session_id
  )
  values (
    v_user_id,
    p_session_id
  );


  return jsonb_build_object(
    'success', true,
    'message', '예약되었습니다.'
  );


exception
  when unique_violation then
    return jsonb_build_object(
      'success', false,
      'message', '이미 예약한 회차입니다.'
    );
end;
$$;


-- 함수는 로그인 사용자만 실행 가능
revoke all
on function public.create_reservation(bigint)
from public;

grant execute
on function public.create_reservation(bigint)
to authenticated;


-- reservations 테이블에 직접 예약을 추가하거나 수정하지 못하게 함
revoke insert, update
on public.reservations
from anon, authenticated;


-- 본인 예약 조회 및 취소는 허용
grant select, delete
on public.reservations
to authenticated;


-- 예약 조회 성능 개선용 인덱스
create index if not exists reservations_session_id_idx
on public.reservations(session_id);

create index if not exists reservations_user_id_idx
on public.reservations(user_id);

create or replace function public.create_reservation_bundle(
  p_session_ids bigint[],
  p_buffer_minutes integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_ids bigint[];
  v_session record;
  v_existing record;
  v_pair record;
  v_reserved_count bigint;
  v_created_count integer := 0;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return jsonb_build_object(
      'success', false,
      'message', '로그인 후 예약할 수 있습니다.'
    );
  end if;

  if p_session_ids is null
    or cardinality(p_session_ids) = 0 then
    return jsonb_build_object(
      'success', false,
      'message', '예약할 회차가 없습니다.'
    );
  end if;

  if p_buffer_minutes < 0
    or p_buffer_minutes > 60 then
    return jsonb_build_object(
      'success', false,
      'message', '이동 여유 시간이 올바르지 않습니다.'
    );
  end if;


  -- 중복된 회차 ID 제거
  select array_agg(x.id order by x.id)
  into v_ids
  from (
    select distinct unnest(p_session_ids) as id
  ) x;


  -- 같은 사용자의 다른 예약 요청과 충돌하지 않도록 잠금
  perform 1
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', '사용자 정보를 찾을 수 없습니다.'
    );
  end if;


  -- 존재하지 않는 회차 검사
  if (
    select count(*)
    from public.sessions s
    where s.id = any(v_ids)
  ) <> cardinality(v_ids) then

    return jsonb_build_object(
      'success', false,
      'message', '일부 회차 정보를 찾을 수 없습니다.'
    );
  end if;


  -- 대상 회차를 ID 순서대로 모두 잠금
  -- 다른 사용자가 동시에 마지막 자리를 예약하지 못하게 함
  perform s.id
  from public.sessions s
  where s.id = any(v_ids)
  order by s.id
  for update;


  -- =====================================================
  -- 선택한 회차들끼리 시간 + 이동 여유 시간 검사
  -- =====================================================

  select
    b1.name as booth1_name,
    s1.round as round1,
    b2.name as booth2_name,
    s2.round as round2
  into v_pair
  from public.sessions s1

  join public.booths b1
    on b1.id = s1.booth_id

  join public.sessions s2
    on s1.id < s2.id

  join public.booths b2
    on b2.id = s2.booth_id

  where s1.id = any(v_ids)
    and s2.id = any(v_ids)

    and s1.start_time <
      s2.end_time +
      p_buffer_minutes * interval '1 minute'

    and s2.start_time <
      s1.end_time +
      p_buffer_minutes * interval '1 minute'

  limit 1;


  if found then
    return jsonb_build_object(
      'success', false,
      'reason', 'time_conflict',
      'message',
        v_pair.booth1_name || ' ' ||
        v_pair.round1 || '회차와 ' ||
        v_pair.booth2_name || ' ' ||
        v_pair.round2 || '회차의 시간이 겹칩니다.'
    );
  end if;


  -- =====================================================
  -- 각 회차 최신 상태 검사
  -- =====================================================

  for v_session in
    select
      s.id,
      s.booth_id,
      s.round,
      s.start_time,
      s.end_time,
      s.capacity,
      s.reserved,
      b.name as booth_name
    from public.sessions s

    join public.booths b
      on b.id = s.booth_id

    where s.id = any(v_ids)

    order by s.id
  loop

    -- 이미 이 회차를 예약한 경우는 다시 예약하지 않음
    if exists (
      select 1
      from public.reservations r
      where r.user_id = v_user_id
        and r.session_id = v_session.id
    ) then
      continue;
    end if;


    -- 최신 실제 예약 인원 확인
    select count(*)
    into v_reserved_count
    from public.reservations r
    where r.session_id = v_session.id;


    -- 추천 이후 누군가 예약해서 마감된 경우
    if (
      v_session.reserved +
      v_reserved_count >=
      v_session.capacity
    ) then

      return jsonb_build_object(
        'success', false,
        'reason', 'full',
        'failedSessionId', v_session.id,
        'failedBoothName', v_session.booth_name,
        'failedRound', v_session.round,
        'failedStartTime',
          to_char(v_session.start_time, 'HH24:MI'),
        'failedEndTime',
          to_char(v_session.end_time, 'HH24:MI'),
        'message',
          '추천 이후 해당 회차가 마감되었습니다.'
      );
    end if;


    -- 기존 내 예약과 시간/이동 여유 시간 충돌 검사
    select
      b.name as booth_name,
      s.round,
      s.start_time,
      s.end_time
    into v_existing
    from public.reservations r

    join public.sessions s
      on s.id = r.session_id

    join public.booths b
      on b.id = s.booth_id

    where r.user_id = v_user_id
      and s.id <> v_session.id

      and v_session.start_time <
        s.end_time +
        p_buffer_minutes * interval '1 minute'

      and s.start_time <
        v_session.end_time +
        p_buffer_minutes * interval '1 minute'

    limit 1;


    if found then
      return jsonb_build_object(
        'success', false,
        'reason', 'existing_conflict',
        'failedSessionId', v_session.id,
        'failedBoothName', v_session.booth_name,
        'failedRound', v_session.round,
        'message',
          '현재 예약 내역과 시간이 겹치거나 이동 시간이 부족합니다.'
      );
    end if;

  end loop;


  -- =====================================================
  -- 모든 검사를 통과한 뒤에만 실제 예약 생성
  -- =====================================================

  for v_session in
    select s.id
    from public.sessions s
    where s.id = any(v_ids)
    order by s.id
  loop

    if not exists (
      select 1
      from public.reservations r
      where r.user_id = v_user_id
        and r.session_id = v_session.id
    ) then

      insert into public.reservations (
        user_id,
        session_id
      )
      values (
        v_user_id,
        v_session.id
      );

      -- 대기 신청돼 있었다면 제거
      delete from public.waitlist
      where user_id = v_user_id
        and session_id = v_session.id;

      v_created_count :=
        v_created_count + 1;
    end if;

  end loop;


  return jsonb_build_object(
    'success', true,
    'createdCount', v_created_count,
    'message', '추천 일정 예약이 완료되었습니다.'
  );
end;
$$;


revoke all
on function public.create_reservation_bundle(bigint[], integer)
from public;

grant execute
on function public.create_reservation_bundle(bigint[], integer)
to authenticated;