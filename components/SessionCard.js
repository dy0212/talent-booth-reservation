"use client";

export default function SessionCard({
  session,
  dbReserved = 0,
  selected,
  onSelect,
}) {
  const remaining =
    session.capacity -
    session.reserved -
    dbReserved;

  const isFull = remaining <= 0;

  return (
    <button
      className={`session-card ${
        selected ? "selected" : ""
      } ${isFull ? "full" : ""}`}
      onClick={() => {
        if (!isFull) {
          onSelect(session.id);
        }
      }}
      disabled={isFull}
    >
      <div className="session-header">
        <strong>{session.round}회차</strong>

        <span>
          {isFull
            ? "마감"
            : `잔여 ${remaining}석`}
        </span>
      </div>

      <div className="session-time">
        {session.startTime} ~ {session.endTime}
      </div>

      {selected && !isFull && (
        <div className="selected-text">
          선택됨
        </div>
      )}
    </button>
  );
}