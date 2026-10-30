"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/");
      } else {
        setMessage(
          "회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요."
        );
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage("이메일 또는 비밀번호를 확인해주세요.");
        setLoading(false);
        return;
      }

      router.push("/");
    }

    setLoading(false);
  }

  return (
    <main>
      <Link href="/" className="back-link">
        ← 부스 목록
      </Link>

      <div className="login-box">
        <h1>
          {mode === "login"
            ? "참가자 로그인"
            : "참가자 회원가입"}
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "처리 중..."
              : mode === "login"
              ? "로그인"
              : "회원가입"}
          </button>
        </form>

        {message && (
          <div className="reservation-message">
            {message}
          </div>
        )}

        <button
          className="login-mode-button"
          onClick={() => {
            setMode(
              mode === "login"
                ? "signup"
                : "login"
            );

            setMessage("");
          }}
        >
          {mode === "login"
            ? "계정이 없나요? 회원가입"
            : "이미 계정이 있나요? 로그인"}
        </button>
      </div>
    </main>
  );
}