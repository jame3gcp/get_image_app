import type { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { promisify } from "util";
import { trace } from "potrace";
import fs from "fs";
import fetch from "node-fetch";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

const traceAsync = promisify(trace);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1. pngUrl 방식 지원
  if (req.headers["content-type"]?.includes("application/json")) {
    try {
      const raw = await getRawBody(req);
      const { pngUrl } = JSON.parse(raw.toString("utf8"));
      if (!pngUrl || typeof pngUrl !== "string") {
        return res.status(400).json({ error: "pngUrl이 필요합니다." });
      }
      const imgRes = await fetch(pngUrl);
      if (!imgRes.ok) {
        return res.status(400).json({ error: "PNG 이미지 다운로드 실패" });
      }
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const svg = await traceAsync(buffer, { color: "black", background: "transparent" });
      return res.status(200).json({ svg });
    } catch (e: any) {
      return res.status(500).json({ error: `SVG 변환 실패: ${e?.message || e}` });
    }
  }

  // 2. 파일 업로드(multipart/form-data)
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "파일 파싱 실패" });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "파일이 첨부되지 않았습니다." });
    }
    const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
    try {
      const buffer = fs.readFileSync(filePath);
      const svg = await traceAsync(buffer, { color: "black", background: "transparent" });
      return res.status(200).json({ svg });
    } catch (e: any) {
      return res.status(500).json({ error: `SVG 변환 실패: ${e?.message || e}` });
    } finally {
      // 임시 파일 삭제
      fs.unlink(filePath, () => {});
    }
  });
}
