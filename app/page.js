"use client";

import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
import BoothCard from "../components/BoothCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [booths, setBooths] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBooths();
  }, []);

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