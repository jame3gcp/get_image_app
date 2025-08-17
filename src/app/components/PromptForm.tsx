"use client";

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  value: string;
  setValue: (v: string) => void;
}

export default function PromptForm({ onSubmit, loading, value, setValue }: PromptFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-8">
      <input
        type="text"
        className="border rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="예: 강아지 로고, 심플한 산과 해"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        maxLength={100}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "이미지 생성 중..." : "AI로 로고 생성하기"}
      </button>
    </form>
  );
}
