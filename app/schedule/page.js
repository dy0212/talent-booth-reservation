"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "../../lib/supabase";

import {
  getMyReservations,
  cancelReservation,
} from "../../utils/reservation";

export default function SchedulePage() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    setLoading(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const currentUser = session?.user ?? null;

    setUser(currentUser);

    if (!currentUser) {
      setReservations([]);
      setLoading(false);
      return;
    }

    const result = await getMyReservations();

    if (!result.success) {
      setMessage(result.message);
      setReservations([]);
      setLoading(false);
      return;
    }

    setReservations(result.reservations);
    setLoading(false);
  }

  async function handleCancel(reservationId) {
    const ok = window.confirm(
      "이 예약을 취소하시겠습니까?"
    );

    if (!ok) {
      return;
    }

    setCancelingId(reservationId);
    setMessage("");

    const result =
      await cancelReservation(reservationId);

    setMessage(result.message);

    if (result.success) {
      const refreshed =
        await getMyReservations();

      if (refreshed.success) {
        setReservations(
          refreshed.reservations
        );
      }
    }

    setCancelingId(null);
  }

  if (loading) {
    return (
      <main>
        <p>시간표를 불러오는 중...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Link
          href="/"
          className="back-link"
        >
          ← 부스 목록
        </Link>

        <div className="schedule-page">
          <h1>내 시간표</h1>

          <p>
            로그인 후 이용할 수 있습니다.
          </p>

          <Link href="/login">
            로그인 / 회원가입
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Link
        href="/"
        className="back-link"
      >
        ← 부스 목록
      </Link>

      <div className="schedule-page">
        <h1>내 시간표</h1>

        <p className="schedule-user">
          로그인 계정:{" "}
          <strong>{user.email}</strong>
        </p>

        {message && (
          <div className="reservation-message">
            {message}
          </div>
        )}

        {reservations.length === 0 ? (
          <p>예약한 부스가 없습니다.</p>
        ) : (
          <div className="reservation-list">
            {reservations.map(
              (reservation) => (
                <div
                  className="reservation-card"
                  key={reservation.id}
                >
                  <div>
                    <h2>
                      {reservation.boothName}
                    </h2>

                    <p>
                      {reservation.round}회차
                    </p>

                    <p>
                      {reservation.startTime}
                      {" ~ "}
                      {reservation.endTime}
                    </p>

                    <p>
                      장소:{" "}
                      {reservation.location}
                    </p>
                  </div>

                  <button
                    className="cancel-button"
                    disabled={
                      cancelingId ===
                      reservation.id
                    }
                    onClick={() =>
                      handleCancel(
                        reservation.id
                      )
                    }
                  >
                    {cancelingId ===
                    reservation.id
                      ? "취소 중..."
                      : "예약 취소"}
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}