"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="부스 이름 검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-bar"
    />
  );
}