"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface GalleryItem {
  id: number;
  imageUrl: string;
  prompt: string;
  rewritten: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState<{ open: boolean; item?: GalleryItem }>({ open: false });

  useEffect(() => {
    if (session) {
      const key = "ai_logo_gallery";
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setItems(data.slice(0, 12)); // 4행 x 3열 = 12개
    }
  }, [session]);

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-6">갤러리</h1>
        <p className="mb-4 text-gray-600">이 기능은 로그인한 사용자만 이용할 수 있습니다.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">갤러리</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">아직 생성된 작품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="border rounded shadow hover:shadow-lg cursor-pointer bg-white flex flex-col items-center p-2"
              onClick={() => setModal({ open: true, item })}
            >
              <img src={item.imageUrl} alt="AI 로고" className="w-48 h-48 object-contain mb-2" />
              <div className="text-xs text-gray-500 truncate w-full text-center mb-1">{item.prompt}</div>
              <div className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      {/* 원본 미리보기 모달 */}
      {modal.open && modal.item && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setModal({ open: false })}
        >
          <div
            className="bg-white rounded shadow-lg p-6 relative max-w-2xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setModal({ open: false })}
              aria-label="닫기"
            >
              ×
            </button>
            <img src={modal.item.imageUrl} alt="AI 로고 원본" className="w-full h-auto mb-4" />
            <div className="text-sm text-gray-700 mb-2">프롬프트: {modal.item.prompt}</div>
            <div className="text-xs text-gray-500">생성일: {new Date(modal.item.createdAt).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
