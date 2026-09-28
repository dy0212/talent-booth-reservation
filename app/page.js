"use client";

import { useState } from "react";

import { booths } from "../data/booths";
import BoothCard from "../components/BoothCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredBooths = booths.filter((booth) =>
    booth.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <h1>재능나눔 부스 예약</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

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