"use client";

export default function SessionCard({
  session,
  dbReserved = 0,
  selected,
  onSelect,
  myReservation = null,
  onCancel,
  canceling = false,
  conflictReservation = null,
}) {
  const remaining =
    session.capacity -
    session.reserved -
    dbReserved;

  const isFull = remaining <= 0;
  const isReservedByMe = myReservation !== null;
  const timeConflict = conflictReservation !== null;

  const unavailable =
    isFull ||
    isReservedByMe ||
    timeConflict;

  return (
    <div
      className={`session-card ${selected ? "selected" : ""
        } ${isFull && !isReservedByMe ? "full" : ""} ${isReservedByMe ? "my-reservation" : ""
        } ${timeConflict ? "time-conflict" : ""}`}
      onClick={() => {
        if (!unavailable && onSelect) {
          onSelect(session.id);
        }
      }}
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

      {isReservedByMe ? (
        <div className="reserved-session-area">
          <span className="reserved-badge">
            예약됨
          </span>

          <button
            className="inline-cancel-button"
            disabled={canceling}
            onClick={(e) => {
              e.stopPropagation();

              if (onCancel) {
                onCancel(myReservation.id);
              }
            }}
          >
            {canceling
              ? "취소 중..."
              : "예약 취소"}
          </button>
        </div>
      ) : timeConflict ? (
        <div className="conflict-area">
          <div className="conflict-text">
            시간 중복
          </div>

          <div className="conflict-detail">
            {conflictReservation.boothName}
            {" · "}
            {conflictReservation.round}회차
          </div>

          <div className="conflict-time">
            {conflictReservation.startTime}
            {" ~ "}
            {conflictReservation.endTime}
          </div>
        </div>
      ) : (
        selected &&
        !isFull && (
          <div className="selected-text">
            선택됨
          </div>
        )
      )}
    </div>
  );
}