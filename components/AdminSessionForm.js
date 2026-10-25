"use client";

import { useEffect, useState } from "react";

export default function AdminSessionForm({
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [capacity, setCapacity] = useState(10);
  const [reserved, setReserved] = useState(0);

  useEffect(() => {
    if (initialData) {
      setRound(initialData.round);
      setStartTime(initialData.start_time.slice(0, 5));
      setEndTime(initialData.end_time.slice(0, 5));
      setCapacity(initialData.capacity);
      setReserved(initialData.reserved);
    } else {
      setRound(1);
      setStartTime("09:00");
      setEndTime("09:30");
      setCapacity(10);
      setReserved(0);
    }
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      round: Number(round),
      start_time: startTime,
      end_time: endTime,
      capacity: Number(capacity),
      reserved: Number(reserved),
    });
  }

  return (
    <form className="admin-form session-admin-form" onSubmit={handleSubmit}>
      <label>
        회차
        <input
          type="number"
          min="1"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          required
        />
      </label>

      <label>
        시작 시간
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>

      <label>
        종료 시간
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </label>

      <label>
        정원
        <input
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </label>

      <label>
        예시 예약 인원
        <input
          type="number"
          min="0"
          value={reserved}
          onChange={(e) => setReserved(e.target.value)}
          required
        />
      </label>

      <div className="admin-form-buttons">
        <button type="submit">
          {initialData ? "회차 수정" : "회차 추가"}
        </button>

        {initialData && (
          <button type="button" onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </form>
  );
}