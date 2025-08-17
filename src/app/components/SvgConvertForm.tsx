"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession, signIn } from "next-auth/react";

export default function SvgConvertForm() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSvg(null);
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSvg(null);
    setError(null);
    if (!file) {
      setError("PNG 파일을 선택해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/logo/vectorize", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "SVG 변환 실패");
      setSvg(data.svg);
    } catch (err: any) {
      setError(err.message || "SVG 변환 실패");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">PNG → SVG 변환</h2>
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
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">PNG → SVG 변환</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <input
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
          disabled={loading || !file}
        >
          {loading ? "SVG 변환 중..." : "SVG로 변환"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {svg && (
        <div className="mt-6 flex flex-col items-center">
          <div
            className="w-64 h-64 border rounded shadow bg-white flex items-center justify-center overflow-auto cursor-pointer"
            style={{ minWidth: 256, minHeight: 256, maxWidth: 256, maxHeight: 256 }}
            onClick={() => setShowModal(true)}
            title="클릭 시 원본 SVG 전체 보기"
          >
            <div
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">SVG 벡터로 변환된 결과입니다.<br/>이미지를 클릭하면 원본 SVG를 크게 볼 수 있습니다.</p>
        </div>
      )}
      {/* SVG 원본 팝업 모달 */}
      {showModal && svg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded shadow-lg p-6 relative max-w-3xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="닫기"
            >
              ×
            </button>
            <div
              className="flex items-center justify-center"
              style={{ minWidth: 400, minHeight: 400 }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
