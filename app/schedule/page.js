"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getReservations,
  cancelReservation,
} from "../../utils/reservation";

export default function SchedulePage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  function handleCancel(reservationId) {
    cancelReservation(reservationId);
    setReservations(getReservations());
  }

  const sortedReservations = [...reservations].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <main>
      <Link href="/" className="back-link">
        ← 부스 목록
      </Link>

      <div className="schedule-page">
        <h1>내 시간표</h1>

        {sortedReservations.length === 0 ? (
          <p>예약한 부스가 없습니다.</p>
        ) : (
          <div className="reservation-list">
            {sortedReservations.map((reservation) => (
              <div
                className="reservation-card"
                key={reservation.id}
              >
                <div>
                  <h2>{reservation.boothName}</h2>

                  <p>
                    {reservation.round}회차
                  </p>

                  <p>
                    {reservation.startTime} ~ {reservation.endTime}
                  </p>

                  <p>
                    장소: {reservation.location}
                  </p>
                </div>

                <button
                  className="cancel-button"
                  onClick={() =>
                    handleCancel(reservation.id)
                  }
                >
                  예약 취소
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}