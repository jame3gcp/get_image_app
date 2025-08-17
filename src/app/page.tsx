"use client";

import PromptForm from "./components/PromptForm";
import SvgConvertForm from "./components/SvgConvertForm";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

const PROMPT_KEY = "ai_logo_prompt";
const PENDING_REQUEST_KEY = "ai_logo_pending_request";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [svgLoading, setSvgLoading] = useState(false);
  const [svgError, setSvgError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const autoRequested = useRef(false);
  const [showSvgModal, setShowSvgModal] = useState(false);

  // 입력값 localStorage 저장/복원
  useEffect(() => {
    const saved = localStorage.getItem(PROMPT_KEY);
    if (saved) setPrompt(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem(PROMPT_KEY, prompt);
  }, [prompt]);

  // 로그인 후 자동 생성 요청
  useEffect(() => {
    if (status === "authenticated" && !autoRequested.current) {
      const pending = localStorage.getItem(PENDING_REQUEST_KEY);
      if (pending === "1" && prompt.trim()) {
        autoRequested.current = true;
        handlePromptSubmit(prompt, true);
        localStorage.removeItem(PENDING_REQUEST_KEY);
      }
    }
  }, [status, prompt]);

  const handlePromptSubmit = async (inputPrompt: string, isAuto = false) => {
    if (!session) {
      // 로그인 전 생성 버튼 클릭 시 대기 상태 저장
      localStorage.setItem(PROMPT_KEY, inputPrompt);
      localStorage.setItem(PENDING_REQUEST_KEY, "1");
      signIn();
      return;
    }
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setRewritten(null);
    setSvg(null);
    setSvgError(null);
    try {
      const res = await fetch("/api/logo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "이미지 생성 실패");
      setImageUrl(data.imageUrl);
      setRewritten(data.rewritten);
      // 갤러리 저장
      saveToGallery({
        imageUrl: data.imageUrl,
        prompt: inputPrompt,
        rewritten: data.rewritten,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || "서버 오류");
    } finally {
      setLoading(false);
      if (!isAuto) localStorage.removeItem(PENDING_REQUEST_KEY);
    }
  };

  const handleSvgConvert = async () => {
    if (!imageUrl) return;
    setSvgLoading(true);
    setSvgError(null);
    setSvg(null);
    try {
      const res = await fetch("/api/logo/vectorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pngUrl: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "SVG 변환 실패");
      setSvg(data.svg);
    } catch (err: any) {
      setSvgError(err.message || "SVG 변환 실패");
    } finally {
      setSvgLoading(false);
    }
  };

  const saveToGallery = (item: any) => {
    const key = "ai_logo_gallery";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([
      { ...item, id: Date.now() },
      ...prev
    ]));
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-24 p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">AI 아이콘·로고 생성 플랫폼</h1>
        <p className="text-gray-700 mb-6">
          생성형 AI와 SVG 편집기를 활용해 나만의 로고·아이콘을 쉽고 빠르게 만들어보세요.<br/>
          무료 체험, 갤러리, 마이페이지, 다양한 편집 기능을 제공합니다.
        </p>
        <PromptForm
          onSubmit={handlePromptSubmit}
          loading={loading}
          value={prompt}
          setValue={setPrompt}
        />
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {rewritten && (
          <div className="mt-4 text-gray-500 text-sm">AI 변환 프롬프트: {rewritten}</div>
        )}
        {imageUrl && (
          <div className="mt-8 flex flex-col items-center">
            <img src={imageUrl} alt="AI 생성 로고" className="w-64 h-64 object-contain border rounded shadow" />
            <p className="text-gray-500 text-sm mt-2">AI가 생성한 로고입니다.</p>
            <button
              onClick={handleSvgConvert}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
              disabled={svgLoading}
            >
              {svgLoading ? "SVG 변환 중..." : "SVG로 변환"}
            </button>
            {svgError && <div className="text-red-500 mt-2">{svgError}</div>}
          </div>
        )}
        {svg && (
          <div className="mt-8 flex flex-col items-center">
            <div
              className="w-64 h-64 border rounded shadow bg-white flex items-center justify-center overflow-auto cursor-pointer"
              style={{ minWidth: 256, minHeight: 256, maxWidth: 256, maxHeight: 256 }}
              onClick={() => setShowSvgModal(true)}
              title="클릭 시 원본 SVG 전체 보기"
            >
              <div
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg style=\"max-width:100%;max-height:100%;\"') }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">SVG 벡터로 변환된 결과입니다.<br/>이미지를 클릭하면 원본 SVG를 크게 볼 수 있습니다.</p>
          </div>
        )}
        {/* SVG 원본 팝업 모달 */}
        {showSvgModal && svg && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setShowSvgModal(false)}
          >
            <div
              className="bg-white rounded shadow-lg p-6 relative max-w-3xl max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
                onClick={() => setShowSvgModal(false)}
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
        <ul className="text-left text-gray-600 text-sm list-disc list-inside mt-10">
          <li>AI 프롬프트로 로고/아이콘 생성</li>
          <li>SVG 변환 및 실시간 편집</li>
          <li>작품 갤러리 및 마켓플레이스</li>
          <li>크레딧 결제 및 Pro 구독</li>
        </ul>
      </div>
      <SvgConvertForm />
    </div>
  );
}
