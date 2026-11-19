"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "../../lib/supabase";

import {
  getMyReservations,
  getSessionReservationCounts,
  reserveRecommendation,
} from "../../utils/reservation";

export default function RecommendPage() {
  const [booths, setBooths] = useState([]);
  const [selectedBoothIds, setSelectedBoothIds] = useState([]);

  const [reservationCounts, setReservationCounts] =
    useState({});

  const [myReservations, setMyReservations] =
    useState([]);

  const [bufferMinutes, setBufferMinutes] =
    useState(5);

  const [recommendations, setRecommendations] =
    useState([]);

  const [bookingIndex, setBookingIndex] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("booths")
      .select(`
        id,
        name,
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
      .order("id");

    if (error) {
      console.error(error);
      setMessage("부스 정보를 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    const convertedBooths = (data ?? []).map((booth) => ({
      ...booth,

      sessions: (booth.sessions ?? [])
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
    }));

    setBooths(convertedBooths);

    const countResults = await Promise.all(
      convertedBooths.map(async (booth) => {
        const counts =
          await getSessionReservationCounts(booth.id);

        return {
          boothId: booth.id,
          counts,
        };
      })
    );

    const mergedCounts = {};

    for (const result of countResults) {
      for (const [sessionId, count] of Object.entries(
        result.counts
      )) {
        mergedCounts[sessionId] = count;
      }
    }

    setReservationCounts(mergedCounts);

    const reservationResult =
      await getMyReservations();

    if (reservationResult.success) {
      setMyReservations(
        reservationResult.reservations
      );
    } else {
      setMyReservations([]);
    }

    setLoading(false);
  }

  function toggleBooth(boothId) {
    setRecommendations([]);
    setMessage("");

    setSelectedBoothIds((current) => {
      if (current.includes(boothId)) {
        return current.filter(
          (id) => id !== boothId
        );
      }

      return [...current, boothId];
    });
  }

  function timeToMinutes(time) {
    const [hour, minute] =
      time.split(":").map(Number);

    return hour * 60 + minute;
  }

  function sessionsConflict(a, b) {
    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);

    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    if (aEnd <= bStart) {
      return aEnd + bufferMinutes > bStart;
    }

    if (bEnd <= aStart) {
      return bEnd + bufferMinutes > aStart;
    }

    return true;
  }

  function conflictsWithMyReservations(session) {
    return myReservations.some((reservation) => {
      if (reservation.sessionId === session.id) {
        return false;
      }

      return sessionsConflict(
        session,
        reservation
      );
    });
  }

  function getCandidates(booth) {
    const existingReservation =
      myReservations.find(
        (reservation) =>
          reservation.boothId === booth.id
      );

    if (existingReservation) {
      const session =
        booth.sessions.find(
          (item) =>
            item.id ===
            existingReservation.sessionId
        );

      if (!session) {
        return [];
      }

      return [
        {
          ...session,
          boothId: booth.id,
          boothName: booth.name,
          location: booth.location,
          remaining: null,
          alreadyReserved: true,
        },
      ];
    }

    return booth.sessions
      .map((session) => {
        const dbReserved =
          reservationCounts[session.id] ?? 0;

        const remaining =
          session.capacity -
          session.reserved -
          dbReserved;

        return {
          ...session,
          boothId: booth.id,
          boothName: booth.name,
          location: booth.location,
          remaining,
          alreadyReserved: false,
        };
      })
      .filter((session) => {
        if (session.remaining <= 0) {
          return false;
        }

        if (
          conflictsWithMyReservations(session)
        ) {
          return false;
        }

        return true;
      });
  }

  function canAddSession(
    session,
    currentSessions
  ) {
    return !currentSessions.some(
      (selected) =>
        sessionsConflict(
          session,
          selected
        )
    );
  }

  function handleRecommend() {
    if (selectedBoothIds.length === 0) {
      setMessage(
        "추천받을 부스를 하나 이상 선택해주세요."
      );
      setRecommendations([]);
      return;
    }

    const selectedBooths =
      booths.filter((booth) =>
        selectedBoothIds.includes(
          booth.id
        )
      );

    const boothCandidates =
      selectedBooths.map((booth) => ({
        booth,
        candidates:
          getCandidates(booth),
      }));

    const results = [];

    function search(
      index,
      currentSessions
    ) {
      if (
        index === boothCandidates.length
      ) {
        results.push([...currentSessions]);
        return;
      }

      const { candidates } =
        boothCandidates[index];

      // 이 부스를 듣지 않는 경우
      search(
        index + 1,
        currentSessions
      );

      // 가능한 회차를 하나 선택하는 경우
      for (const session of candidates) {
        if (
          canAddSession(
            session,
            currentSessions
          )
        ) {
          currentSessions.push(session);

          search(
            index + 1,
            currentSessions
          );

          currentSessions.pop();
        }
      }
    }

    search(0, []);

    const sortedResults = results
      .filter(
        (result) => result.length > 0
      )
      .map((result) =>
        [...result].sort(
          (a, b) =>
            timeToMinutes(a.startTime) -
            timeToMinutes(b.startTime)
        )
      )
      .sort((a, b) => {
        // 1순위: 더 많은 부스를 들을 수 있는 조합
        if (b.length !== a.length) {
          return b.length - a.length;
        }

        // 2순위: 남은 좌석이 많은 조합
        const aRemaining =
          a.reduce(
            (sum, session) =>
              sum +
              (session.remaining ?? 0),
            0
          );

        const bRemaining =
          b.reduce(
            (sum, session) =>
              sum +
              (session.remaining ?? 0),
            0
          );

        return bRemaining - aRemaining;
      });

    const unique = [];
    const seen = new Set();

    for (const result of sortedResults) {
      const key = result
        .map((session) => session.id)
        .sort((a, b) => a - b)
        .join("-");

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      unique.push(result);

      if (unique.length >= 3) {
        break;
      }
    }

    setRecommendations(unique);

    if (unique.length === 0) {
      setMessage(
        "현재 조건에서 가능한 일정 조합을 찾지 못했습니다."
      );
      return;
    }

    const bestCount =
      unique[0].length;

    if (
      bestCount ===
      selectedBoothIds.length
    ) {
      setMessage(
        "선택한 부스를 모두 참여할 수 있는 일정을 찾았습니다."
      );
    } else {
      setMessage(
        `선택한 ${selectedBoothIds.length}개 부스 중 최대 ${bestCount}개까지 참여할 수 있습니다.`
      );
    }
  }

  async function handleBookRecommendation(
  recommendation,
  index
) {
  const sessionIds = recommendation
    .filter(
      (session) =>
        !session.alreadyReserved
    )
    .map((session) => session.id);

  if (sessionIds.length === 0) {
    setMessage(
      "이 일정의 회차는 이미 모두 예약되어 있습니다."
    );
    return;
  }

  setBookingIndex(index);

  const result =
    await reserveRecommendation(
      sessionIds,
      bufferMinutes
    );

  if (result.success) {
    setMessage(
      `${result.createdCount}개 회차를 예약했습니다.`
    );

    setRecommendations([]);

    await loadData();

    setBookingIndex(null);
    return;
  }


  // 추천 후 누군가 마지막 자리를 예약한 경우
  if (
    result.reason === "full" &&
    result.failedBoothName
  ) {
    setMessage(
      `${result.failedBoothName} · ${result.failedRound}회차 ` +
      `(${result.failedStartTime} ~ ${result.failedEndTime})가 ` +
      `추천 이후 마감되었습니다. ` +
      `아무 회차도 예약하지 않았습니다. 다시 추천해주세요.`
    );
  } else {
    setMessage(
      `${result.message} 아무 회차도 예약하지 않았습니다. 다시 추천해주세요.`
    );
  }

  // 오래된 추천 결과 제거
  setRecommendations([]);

  // 최신 잔여석 다시 불러오기
  await loadData();

  setBookingIndex(null);
}

  if (loading) {
    return (
      <main>
        <p>
          추천 정보를 불러오는 중...
        </p>
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

      <div className="recommend-page">
        <h1>부스 일정 추천</h1>

        <p className="recommend-description">
          참여하고 싶은 부스를 선택하면
          잔여석, 시간 중복, 이동 여유 시간을
          고려해 가능한 회차 조합을 추천합니다.
        </p>

        <h2>1. 원하는 부스 선택</h2>

        <div className="recommend-booth-list">
          {booths.map((booth) => {
            const selected =
              selectedBoothIds.includes(
                booth.id
              );

            return (
              <button
                key={booth.id}
                className={`recommend-booth ${
                  selected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  toggleBooth(booth.id)
                }
              >
                <strong>
                  {booth.name}
                </strong>

                <span>
                  {booth.location}
                </span>
              </button>
            );
          })}
        </div>

        <h2>2. 이동 여유 시간</h2>

        <div className="buffer-options">
          {[0, 5, 10].map(
            (minutes) => (
              <button
                key={minutes}
                className={
                  bufferMinutes ===
                  minutes
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setBufferMinutes(
                    minutes
                  );

                  setRecommendations(
                    []
                  );
                }}
              >
                {minutes}분
              </button>
            )
          )}
        </div>

        <button
          className="recommend-button"
          onClick={handleRecommend}
        >
          일정 추천
        </button>

        {message && (
          <div className="recommend-message">
            {message}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommend-results">
            <h2>추천 결과</h2>

            <p className="recommend-notice">
              잔여석은 추천 시점 기준입니다.
              예약을 확정할 때 최신 잔여석과 시간 조건을
              다시 확인합니다.
            </p>

            {recommendations.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="recommend-result-card"
                >
                  <h3>
                    추천 {index + 1}
                  </h3>

                  <p>
                    {
                      recommendation.length
                    }
                    개 부스 참여 가능
                  </p>

                  <div className="recommend-schedule">
                    {recommendation.map(
                      (session) => (
                        <div
                          key={
                            session.id
                          }
                          className="recommend-session"
                        >
                          <div>
                            <strong>
                              {
                                session.boothName
                              }
                            </strong>

                            {session.alreadyReserved && (
                              <span className="recommend-reserved">
                                예약됨
                              </span>
                            )}
                          </div>

                          <div>
                            {
                              session.round
                            }
                            회차 ·{" "}
                            {
                              session.startTime
                            }{" "}
                            ~{" "}
                            {
                              session.endTime
                            }
                          </div>

                          <div>
                            {
                              session.location
                            }
                          </div>

                          {!session.alreadyReserved && (
                            <div>
                              잔여{" "}
                              {
                                session.remaining
                              }
                              석
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  
                  <button
                    className="recommend-book-button"
                    disabled={bookingIndex !== null}
                    onClick={() =>
                      handleBookRecommendation(
                        recommendation,
                        index
                      )
                    }
                  >
                    {bookingIndex === index
                      ? "최신 상태 확인 중..."
                      : "이 조합으로 예약하기"}
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