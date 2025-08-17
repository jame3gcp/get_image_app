"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <button
        onClick={() => signIn("google")}
        className="w-full py-3 mb-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
      >
        구글 계정으로 로그인
      </button>
      <p className="text-gray-600 text-sm mt-2">
        OAuth2 기반 로그인(구글, 깃허브 등)이 이곳에 구현될 예정입니다.
      </p>
    </div>
  );
}
