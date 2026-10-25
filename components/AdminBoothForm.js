"use client";

import { useEffect, useState } from "react";

export default function AdminBoothForm({
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setDescription(initialData.description ?? "");
      setLocation(initialData.location ?? "");
    } else {
      setName("");
      setDescription("");
      setLocation("");
    }
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      description,
      location,
    });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="부스 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        placeholder="부스 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="장소"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <div className="admin-form-buttons">
        <button type="submit">
          {initialData ? "수정 완료" : "부스 추가"}
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