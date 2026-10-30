import { supabase } from "../lib/supabase";

function isTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

export async function getSessionReservationCount(sessionId) {
  const { data, error } = await supabase.rpc(
    "get_session_reservation_count",
    {
      p_session_id: sessionId,
    }
  );

  if (error) {
    console.error(error);
    return 0;
  }

  return Number(data ?? 0);
}

export async function addReservation(booth, session) {
  // 1. 로그인 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "로그인 후 예약할 수 있습니다.",
    };
  }

  // 2. 같은 회차를 이미 예약했는지 확인
  const { data: existingReservation, error: existingError } =
    await supabase
      .from("reservations")
      .select("id")
      .eq("session_id", session.id)
      .maybeSingle();

  if (existingError) {
    console.error(existingError);

    return {
      success: false,
      message: "예약 정보를 확인하지 못했습니다.",
    };
  }

  if (existingReservation) {
    return {
      success: false,
      message: "이미 예약한 회차입니다.",
    };
  }

  // 3. 본인의 기존 예약 불러오기
  const { data: myReservations, error: reservationError } =
    await supabase
      .from("reservations")
      .select(`
        id,
        session_id,
        sessions (
          id,
          start_time,
          end_time
        )
      `);

  if (reservationError) {
    console.error(reservationError);

    return {
      success: false,
      message: "기존 예약을 확인하지 못했습니다.",
    };
  }

  // 4. 시간 중복 검사
  const timeConflict = (myReservations ?? []).some(
    (reservation) => {
      const existingSession = reservation.sessions;

      if (!existingSession) {
        return false;
      }

      return isTimeOverlap(
        session.startTime,
        session.endTime,
        existingSession.start_time.slice(0, 5),
        existingSession.end_time.slice(0, 5)
      );
    }
  );

  if (timeConflict) {
    return {
      success: false,
      message: "이미 예약한 다른 부스와 시간이 겹칩니다.",
    };
  }

  // 5. 전체 실제 예약 수 확인
  const actualReserved =
    await getSessionReservationCount(session.id);

  const totalReserved =
    session.reserved + actualReserved;

  if (totalReserved >= session.capacity) {
    return {
      success: false,
      message: "해당 회차의 정원이 모두 찼습니다.",
    };
  }

  // 6. Supabase DB에 예약 저장
  const { error: insertError } = await supabase
    .from("reservations")
    .insert({
      user_id: user.id,
      session_id: session.id,
    });

  if (insertError) {
    console.error(insertError);

    // unique(user_id, session_id)
    if (insertError.code === "23505") {
      return {
        success: false,
        message: "이미 예약한 회차입니다.",
      };
    }

    return {
      success: false,
      message: "예약 저장에 실패했습니다.",
    };
  }

  return {
    success: true,
    message: "예약되었습니다.",
  };
}

export async function getReservations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      id,
      created_at,
      session_id,
      sessions (
        id,
        round,
        start_time,
        end_time,
        booths (
          id,
          name,
          location
        )
      )
    `)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function cancelReservation(reservationId) {
  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", reservationId);

  if (error) {
    console.error(error);

    return {
      success: false,
      message: "예약 취소에 실패했습니다.",
    };
  }

  return {
    success: true,
    message: "예약을 취소했습니다.",
  };
}