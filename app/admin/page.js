"use client";

import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

import AdminBoothForm from "../../components/AdminBoothForm";
import AdminSessionForm from "../../components/AdminSessionForm";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [booths, setBooths] = useState([]);

  const [editingBooth, setEditingBooth] = useState(null);
  const [addingSessionBoothId, setAddingSessionBoothId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setUser(user);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    await loadBooths();

    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();

    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("로그인에 실패했습니다.");
      return;
    }

    await checkUser();
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setUser(null);
    setIsAdmin(false);
    setBooths([]);
  }

  async function loadBooths() {
    const { data, error } = await supabase
      .from("booths")
      .select(`
        *,
        sessions (*)
      `)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setMessage("부스 정보를 불러오지 못했습니다.");
      return;
    }

    const sorted = (data ?? []).map((booth) => ({
      ...booth,
      sessions: [...(booth.sessions ?? [])].sort(
        (a, b) => a.round - b.round
      ),
    }));

    setBooths(sorted);
  }

  async function createBooth(formData) {
    setMessage("");

    const { error } = await supabase
      .from("booths")
      .insert(formData);

    if (error) {
      console.error(error);
      setMessage("부스 추가에 실패했습니다.");
      return;
    }

    setMessage("부스를 추가했습니다.");

    await loadBooths();
  }

  async function updateBooth(formData) {
    if (!editingBooth) return;

    const { error } = await supabase
      .from("booths")
      .update(formData)
      .eq("id", editingBooth.id);

    if (error) {
      console.error(error);
      setMessage("부스 수정에 실패했습니다.");
      return;
    }

    setEditingBooth(null);
    setMessage("부스 정보를 수정했습니다.");

    await loadBooths();
  }

  async function deleteBooth(booth) {
    const ok = window.confirm(
      `"${booth.name}" 부스를 삭제하시겠습니까?\n회차 정보도 함께 삭제됩니다.`
    );

    if (!ok) return;

    const { error } = await supabase
      .from("booths")
      .delete()
      .eq("id", booth.id);

    if (error) {
      console.error(error);
      setMessage("부스 삭제에 실패했습니다.");
      return;
    }

    setMessage("부스를 삭제했습니다.");

    await loadBooths();
  }

  async function createSession(boothId, formData) {
    const { error } = await supabase
      .from("sessions")
      .insert({
        booth_id: boothId,
        ...formData,
      });

    if (error) {
      console.error(error);
      setMessage("회차 추가에 실패했습니다.");
      return;
    }

    setAddingSessionBoothId(null);
    setMessage("회차를 추가했습니다.");

    await loadBooths();
  }

  async function updateSession(formData) {
    if (!editingSession) return;

    const { error } = await supabase
      .from("sessions")
      .update(formData)
      .eq("id", editingSession.id);

    if (error) {
      console.error(error);
      setMessage("회차 수정에 실패했습니다.");
      return;
    }

    setEditingSession(null);
    setMessage("회차를 수정했습니다.");

    await loadBooths();
  }

  async function deleteSession(session) {
    const ok = window.confirm(
      `${session.round}회차를 삭제하시겠습니까?`
    );

    if (!ok) return;

    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", session.id);

    if (error) {
      console.error(error);
      setMessage("회차 삭제에 실패했습니다.");
      return;
    }

    setMessage("회차를 삭제했습니다.");

    await loadBooths();
  }

  if (loading) {
    return (
      <main>
        <p>불러오는 중...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-main">
        <div className="admin-login">
          <h1>관리자 로그인</h1>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="관리자 이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              로그인
            </button>
          </form>

          {message && (
            <p className="admin-message">
              {message}
            </p>
          )}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main>
        <h1>접근 권한 없음</h1>

        <p>
          이 계정은 관리자 계정이 아닙니다.
        </p>

        <button onClick={handleLogout}>
          로그아웃
        </button>
      </main>
    );
  }

  return (
    <main className="admin-main">
      <div className="admin-header">
        <div>
          <h1>부스 관리자</h1>
          <p>{user.email}</p>
        </div>

        <button onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <section className="admin-section">
        <h2>
          {editingBooth
            ? "부스 수정"
            : "새 부스 추가"}
        </h2>

        <AdminBoothForm
          initialData={editingBooth}
          onSubmit={
            editingBooth
              ? updateBooth
              : createBooth
          }
          onCancel={() =>
            setEditingBooth(null)
          }
        />
      </section>

      <section className="admin-section">
        <h2>등록된 부스</h2>

        <div className="admin-booth-list">
          {booths.map((booth) => (
            <div
              className="admin-booth-card"
              key={booth.id}
            >
              <div className="admin-booth-header">
                <div>
                  <h3>{booth.name}</h3>

                  <p>{booth.description}</p>

                  <strong>
                    장소: {booth.location}
                  </strong>
                </div>

                <div className="admin-actions">
                  <button
                    onClick={() =>
                      setEditingBooth(booth)
                    }
                  >
                    수정
                  </button>

                  <button
                    onClick={() =>
                      deleteBooth(booth)
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="admin-session-list">
                <h4>회차</h4>

                {booth.sessions.length === 0 && (
                  <p>등록된 회차가 없습니다.</p>
                )}

                {booth.sessions.map(
                  (session) => (
                    <div
                      className="admin-session-row"
                      key={session.id}
                    >
                      <div>
                        <strong>
                          {session.round}회차
                        </strong>

                        <span>
                          {session.start_time.slice(
                            0,
                            5
                          )}
                          {" ~ "}
                          {session.end_time.slice(
                            0,
                            5
                          )}
                        </span>

                        <span>
                          정원 {session.capacity}명
                        </span>

                        <span>
                          예약 {session.reserved}명
                        </span>
                      </div>

                      <div className="admin-actions">
                        <button
                          onClick={() =>
                            setEditingSession(
                              session
                            )
                          }
                        >
                          수정
                        </button>

                        <button
                          onClick={() =>
                            deleteSession(session)
                          }
                        >
                          삭제
                        </button>
                      </div>

                      {editingSession?.id ===
                        session.id && (
                        <AdminSessionForm
                          initialData={
                            editingSession
                          }
                          onSubmit={
                            updateSession
                          }
                          onCancel={() =>
                            setEditingSession(
                              null
                            )
                          }
                        />
                      )}
                    </div>
                  )
                )}

                {addingSessionBoothId ===
                booth.id ? (
                  <AdminSessionForm
                    onSubmit={(data) =>
                      createSession(
                        booth.id,
                        data
                      )
                    }
                    onCancel={() =>
                      setAddingSessionBoothId(
                        null
                      )
                    }
                  />
                ) : (
                  <button
                    className="add-session-button"
                    onClick={() =>
                      setAddingSessionBoothId(
                        booth.id
                      )
                    }
                  >
                    + 회차 추가
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}