"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { booths } from "../../../data/booths";
import SessionCard from "../../../components/SessionCard";

export default function BoothDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const booth = booths.find((booth) => booth.id === id);

  const [selectedSession, setSelectedSession] = useState(null);

  if (!booth) {
    return (
      <main>
        <h1>부스를 찾을 수 없습니다.</h1>

        <Link href="/">
          목록으로 돌아가기
        </Link>
      </main>
    );
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
          {booth.sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              selected={selectedSession === session.id}
              onSelect={setSelectedSession}
            />
          ))}
        </div>

        {selectedSession && (
          <div className="selection-result">
            선택한 회차:{" "}
            {
              booth.sessions.find(
                (session) => session.id === selectedSession
              ).round
            }
            회차
          </div>
        )}
      </div>
    </main>
  );
}