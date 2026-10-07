const STORAGE_KEY = "talent-booth-reservations";

export function getReservations() {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

function isTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

export function addReservation(booth, session) {
  const reservations = getReservations();

  const alreadyReserved = reservations.some(
    (reservation) => reservation.sessionId === session.id
  );

  if (alreadyReserved) {
    return {
      success: false,
      message: "이미 예약한 회차입니다.",
    };
  }

  // 시간 중복 검사
  const timeConflict = reservations.some((reservation) =>
    isTimeOverlap(
      session.startTime,
      session.endTime,
      reservation.startTime,
      reservation.endTime
    )
  );

  if (timeConflict) {
    return {
      success: false,
      message: "이미 예약한 다른 부스와 시간이 겹칩니다.",
    };
  }

  const localReservedCount = reservations.filter(
    (reservation) => reservation.sessionId === session.id
  ).length;

  const remaining =
    session.capacity - session.reserved - localReservedCount;
  if (remaining <= 0) {
    
    return {
      success: false,
      message: "해당 회차의 정원이 모두 찼습니다.",
    };
  }

  const newReservation = {
    id: Date.now(),
    boothId: booth.id,
    boothName: booth.name,
    location: booth.location,

    sessionId: session.id,
    round: session.round,
    startTime: session.startTime,
    endTime: session.endTime,
  };

  const updatedReservations = [
    ...reservations,
    newReservation,
  ];

  saveReservations(updatedReservations);

  return {
    success: true,
    message: "예약되었습니다.",
    reservation: newReservation,
  };
}

export function cancelReservation(reservationId) {
  const reservations = getReservations();

  const updatedReservations = reservations.filter(
    (reservation) => reservation.id !== reservationId
  );

  saveReservations(updatedReservations);
}

export function getLocalReservedCount(sessionId) {
  const reservations = getReservations();

  return reservations.filter(
    (reservation) => reservation.sessionId === sessionId
  ).length;
}