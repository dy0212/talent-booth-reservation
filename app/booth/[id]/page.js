"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { booths } from "../../../data/booths";
import SessionCard from "../../../components/SessionCard";

import {
  addReservation,
  getReservations,
} from "../../../utils/reservation";

export default function BoothDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const booth = booths.find((booth) => booth.id === id);

  const [selectedSession, setSelectedSession] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  if (!booth) {
    return (
      <main>
        <h1>부스를 찾을 수 없습니다.</h1>
        <Link href="/">목록으로 돌아가기</Link>
      </main>
    );
  }

  function getReservedCount(sessionId) {
    return reservations.filter(
      (reservation) => reservation.sessionId === sessionId
    ).length;
  }

  function handleReserve() {
    if (selectedSession === null) {
      setMessage("예약할 회차를 선택해주세요.");
      return;
    }

    const session = booth.sessions.find(
      (session) => session.id === selectedSession
    );

    const result = addReservation(booth, session);

    setMessage(result.message);

    if (result.success) {
      setReservations(getReservations());
      setSelectedSession(null);
    }
  }

  return (
    <main>
      <Link href="/" className="back-link">
        ← 부스 목록
      </Link>

      <div className="booth-detail">
        <h1>{booth.name}</h1>

        <p className="booth-description">
          {booth.description}
        </p>

        <p className="booth-location">
          <strong>장소:</strong> {booth.location}
        </p>

        <h2>회차 선택</h2>

        <div className="session-list">
          {booth.sessions.map((session) => {
            const localReserved = getReservedCount(session.id);

            return (
              <SessionCard
                key={session.id}
                session={session}
                localReserved={localReserved}
                selected={selectedSession === session.id}
                onSelect={(sessionId) => {
                  setSelectedSession(sessionId);
                  setMessage("");
                }}
              />
            );
          })}
        </div>

        <button
          className="reserve-button"
          onClick={handleReserve}
        >
          예약하기
        </button>

        {message && (
          <div className="reservation-message">
            {message}
          </div>
        )}

        <Link href="/schedule" className="schedule-link">
          내 시간표 보기 →
        </Link>
      </div>
    </main>
  );
}