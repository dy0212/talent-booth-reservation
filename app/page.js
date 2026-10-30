"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "../lib/supabase";
import BoothCard from "../components/BoothCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [booths, setBooths] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadBooths();
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      loadAdminStatus(currentUser.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const currentUser = session?.user ?? null;

    setUser(currentUser);

    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    await loadAdminStatus(currentUser.id);
  }

  async function loadAdminStatus(userId) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(error);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(profile?.role === "admin");
  }

  async function loadBooths() {
    setLoading(true);

    const { data, error } = await supabase
      .from("booths")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setErrorMessage("부스 정보를 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    setBooths(data ?? []);
    setLoading(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    setUser(null);
    setIsAdmin(false);
  }

  const filteredBooths = booths.filter((booth) =>
    booth.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main>
        <p>부스 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>재능나눔 부스 예약</h1>

      <div className="main-actions">
        {user ? (
          <>
            <span>
              로그인됨: <strong>{user.email}</strong>
            </span>

            {isAdmin && (
              <Link href="/admin">
                관리자 페이지
              </Link>
            )}

            <Link href="/schedule">
              내 시간표
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              로그인 / 회원가입
            </Link>

            <Link href="/schedule">
              내 시간표
            </Link>
          </>
        )}
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {errorMessage && (
        <div className="reservation-message">
          {errorMessage}
        </div>
      )}

      <div className="booth-list">
        {filteredBooths.length > 0 ? (
          filteredBooths.map((booth) => (
            <BoothCard
              key={booth.id}
              booth={booth}
            />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </main>
  );
}