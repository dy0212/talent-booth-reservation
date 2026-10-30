import { supabase } from "../lib/supabase";

export async function addReservation(sessionId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "로그인 후 예약할 수 있습니다.",
    };
  }

  const { data, error } = await supabase.rpc(
    "create_reservation",
    {
      p_session_id: sessionId,
    }
  );

  if (error) {
    console.error(error);

    return {
      success: false,
      message: "예약 처리 중 오류가 발생했습니다.",
    };
  }

  return data;
}

export async function getSessionReservationCounts(boothId) {
  const { data, error } = await supabase.rpc(
    "get_session_reservation_counts",
    {
      p_booth_id: boothId,
    }
  );

  if (error) {
    console.error(error);
    return {};
  }

  const counts = {};

  for (const row of data ?? []) {
    counts[row.session_id] = Number(row.reservation_count);
  }

  return counts;
}

export async function getMyReservations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      reservations: [],
      message: "로그인이 필요합니다.",
    };
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
    `);

  if (error) {
    console.error(error);

    return {
      success: false,
      reservations: [],
      message: "예약 정보를 불러오지 못했습니다.",
    };
  }

  const reservations = (data ?? [])
    .map((reservation) => ({
      id: reservation.id,
      sessionId: reservation.session_id,

      round: reservation.sessions?.round,
      startTime:
        reservation.sessions?.start_time?.slice(0, 5) ?? "",
      endTime:
        reservation.sessions?.end_time?.slice(0, 5) ?? "",

      boothId: reservation.sessions?.booths?.id,
      boothName:
        reservation.sessions?.booths?.name ?? "알 수 없는 부스",
      location:
        reservation.sessions?.booths?.location ?? "",
    }))
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  return {
    success: true,
    reservations,
  };
}

export async function cancelReservation(reservationId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "로그인이 필요합니다.",
    };
  }

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