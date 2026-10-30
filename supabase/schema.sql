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