"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavigationBar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="font-bold text-lg">
        <Link href="/">AI Logo Platform</Link>
      </div>
      <ul className="flex gap-6 items-center">
        <li><Link href="/gallery">갤러리</Link></li>
        {session ? (
          <>
            <li><Link href="/mypage">마이페이지</Link></li>
            <li className="text-gray-500 text-sm">{session.user?.email}</li>
            <li><button onClick={() => signOut()} className="text-blue-600 hover:underline">로그아웃</button></li>
          </>
        ) : (
          <li><button onClick={() => signIn()} className="text-blue-600 hover:underline">로그인</button></li>
        )}
      </ul>
    </nav>
  );
}
