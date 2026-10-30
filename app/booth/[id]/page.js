"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "../../../lib/supabase";
import SessionCard from "../../../components/SessionCard";

import {
  addReservation,
  cancelReservation,
  getMyReservations,
  getSessionReservationCounts,
} from "../../../utils/reservation";

export default function BoothDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [booth, setBooth] = useState(null);

  const [selectedSession, setSelectedSession] =
    useState(null);

  const [reservationCounts, setReservationCounts] =
    useState({});

  const [myReservations, setMyReservations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [reserving, setReserving] =
    useState(false);

  const [cancelingId, setCancelingId] =
    useState(null);

  useEffect(() => {
    loadPage();
  }, [id]);

  async function loadPage() {
    setLoading(true);

    await loadBooth();
    await loadMyReservations();

    setLoading(false);
  }

  async function loadBooth() {
    const { data, error } = await supabase
      .from("booths")
      .select(`
        id,
        name,
        description,
        location,
        sessions (
          id,
          round,
          start_time,
          end_time,
          capacity,
          reserved
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setBooth(null);
      return;
    }

    const convertedBooth = {
      ...data,

      sessions: (data.sessions ?? [])
        .sort((a, b) => a.round - b.round)
        .map((session) => ({
          id: session.id,
          round: session.round,

          startTime:
            session.start_time.slice(0, 5),

          endTime:
            session.end_time.slice(0, 5),

          capacity: session.capacity,
          reserved: session.reserved,
        })),
    };

    setBooth(convertedBooth);

    await loadCounts();
  }

  async function loadCounts() {
    const counts =
      await getSessionReservationCounts(id);

    setReservationCounts(counts);
  }

  async function loadMyReservations() {
    const result =
      await getMyReservations();

    if (!result.success) {
      setMyReservations([]);
      return;
    }

    setMyReservations(result.reservations);
  }

  function findMyReservation(sessionId) {
    return (
      myReservations.find(
        (reservation) =>
          reservation.sessionId === sessionId
      ) ?? null
    );
  }

  function findTimeConflict(session) {
    return (
      myReservations.find((reservation) => {
        if (reservation.sessionId === session.id) {
          return false;
        }

        return (
          session.startTime < reservation.endTime &&
          reservation.startTime < session.endTime
        );
      }) ?? null
    );
  }

  async function handleReserve() {
    if (selectedSession === null) {
      setMessage(
        "예약할 회차를 선택해주세요."
      );
      return;
    }

    setReserving(true);
    setMessage("");

    const result =
      await addReservation(selectedSession);

    setMessage(result.message);

    if (result.success) {
      setSelectedSession(null);

      await Promise.all([
        loadCounts(),
        loadMyReservations(),
      ]);
    }

    setReserving(false);
  }

  async function handleCancel(reservationId) {
    const ok = window.confirm(
      "이 회차의 예약을 취소하시겠습니까?"
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
      await Promise.all([
        loadCounts(),
        loadMyReservations(),
      ]);
    }

    setCancelingId(null);
  }

  if (loading) {
    return (
      <main>
        <p>
          부스 정보를 불러오는 중...
        </p>
      </main>
    );
  }

  if (!booth) {
    return (
      <main>
        <h1>
          부스를 찾을 수 없습니다.
        </h1>

        <Link href="/">
          목록으로 돌아가기
        </Link>
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

      <div className="booth-detail">
        <h1>{booth.name}</h1>

        <p className="booth-description">
          {booth.description}
        </p>

        <p className="booth-location">
          <strong>장소:</strong>{" "}
          {booth.location}
        </p>

        <h2>회차 선택</h2>

        <div className="session-list">
          {booth.sessions.map((session) => {
            const myReservation =
              findMyReservation(session.id);

            const conflictReservation =
              findTimeConflict(session);

            return (
              <SessionCard
                key={session.id}
                session={session}
                dbReserved={
                  reservationCounts[session.id] ?? 0
                }
                selected={
                  selectedSession === session.id
                }
                onSelect={(sessionId) => {
                  setSelectedSession(sessionId);
                  setMessage("");
                }}
                myReservation={myReservation}
                onCancel={handleCancel}
                canceling={
                  myReservation
                    ? cancelingId === myReservation.id
                    : false
                }
                conflictReservation={conflictReservation}
              />
            );
          })}
        </div>

        <button
          className="reserve-button"
          onClick={handleReserve}
          disabled={reserving}
        >
          {reserving
            ? "예약 처리 중..."
            : "예약하기"}
        </button>

        {message && (
          <div className="reservation-message">
            {message}
          </div>
        )}

        <Link
          href="/schedule"
          className="schedule-link"
        >
          내 시간표 보기 →
        </Link>
      </div>
    </main>
  );
}