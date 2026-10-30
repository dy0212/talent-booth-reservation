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