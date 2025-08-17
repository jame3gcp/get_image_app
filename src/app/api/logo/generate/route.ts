import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "프롬프트가 필요합니다." }, { status: 400 });
    }

    // 1. 프롬프트 리라이팅 (GPT-4o-text)
    const rewriteRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant that rewrites logo/icon prompts in English for AI image generation. Be concise and add style keywords if possible." },
          { role: "user", content: prompt },
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });
    if (!rewriteRes.ok) {
      const err = await rewriteRes.json();
      return NextResponse.json({ error: `리라이팅 실패: ${err.error?.message || rewriteRes.statusText}` }, { status: 500 });
    }
    const rewriteData = await rewriteRes.json();
    const rewritten = rewriteData.choices?.[0]?.message?.content?.trim() || prompt;

    // 2. 이미지 생성 (DALL·E 3, gpt-4o-image)
    const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: rewritten,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      }),
    });
    if (!imageRes.ok) {
      const err = await imageRes.json();
      return NextResponse.json({ error: `이미지 생성 실패: ${err.error?.message || imageRes.statusText}` }, { status: 500 });
    }
    const imageData = await imageRes.json();
    const imageUrl = imageData.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "이미지 생성 실패: 이미지 URL 없음" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl, rewritten });
  } catch (err: any) {
    return NextResponse.json({ error: `서버 오류: ${err?.message || err}` }, { status: 500 });
  }
}
