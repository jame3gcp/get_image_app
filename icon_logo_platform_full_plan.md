# 아이콘·로고 생성 플랫폼 — 종합 서비스 기획서 (with 개발 기획서)

> 최신 모델 **OpenAI GPT‑4o (gpt-image-1)** 기반. 핵심 가치: **프롬프트 리라이팅 + SVG 벡터화**로 ‘누구나 브랜드 로고와 아이콘을 쉽게 만들 수 있게’.  
> 대상: **스타트업 / 디자이너 / SNS 크리에이터**

---

## 1. 서비스 개요

### 1.1 비전 & 미션
- **비전**: 아이디어와 언어만으로 브랜드의 첫인상을 완성하는 디폴트 툴.
- **미션**: 고품질 로고/아이콘을 **수분 내 생성 → 벡터 편집 → 멀티 채널 배포**까지 원스톱 제공.

### 1.2 해결하려는 문제
- 로고 제작의 **진입장벽(시간/비용/전문성)**이 높다.
- 아이콘/로고를 다양한 채널(웹, 앱, SNS, 인쇄)에 쓰려면 **SVG 및 변형본**이 필요하다.
- 초안 → 피드백 → 수정 → 확정까지 **반복 작업**이 번거롭다.

### 1.3 제안하는 해법
- **프롬프트 리라이팅**으로 초보자도 전문가급 결과 유도
- **아이콘·로고 특화 생성**(배경 투명, 최소색, 벡터 친화)
- **자동 SVG 변환** + 웹 기반 **SVG 에디터**
- **브랜드 키트**(색/폰트/레이아웃)와 **다운스트림 템플릿**(명함/배너/썸네일)

---

## 2. 시장 및 타깃 세분화

### 2.1 스타트업 (초기 창업팀)
- **필요**: 빠른 시안, 저비용, 상업 라이선스, 멀티 포맷
- **핵심 JTBD**: “이번 주 피치 전에 로고와 간단한 브랜드 키트를 갖추고 싶다.”
- **주요 플로우**: 온보딩(산업/무드/키워드) → 5~10개 시안 → SVG 편집 → 키트 다운로드

### 2.2 디자이너 (프리랜서/에이전시)
- **필요**: 스케치 가속, 컨셉 탐색, 벡터 레이어 편집, 고객 공유
- **JTBD**: “여러 방향의 시안을 빠르게 만들어 클라이언트 옵션을 확장하고 싶다.”
- **플로우**: 프리셋/팔레트 설정 → 대량 생성 → 선별/편집 → 버전 비교/공유

### 2.3 SNS 사용자/크리에이터
- **필요**: 간단 생성, 프로필/배너 즉시 적용, 템플릿
- **JTBD**: “내 채널에 맞는 아이콘/워드마크를 금방 쓰고 싶다.”
- **플로우**: 키워드 → 자동 생성 → 색상/텍스트만 수정 → PNG/SVG 즉시 배포

---

## 3. 경쟁/차별화 포인트

| 구분 | 일반 로고 메이커 | 범용 이미지 생성 | **본 서비스(제안)** |
|---|---|---|---|
| 초보 난이도 | 중 | 중~상 | **매우 낮음(프롬프트 리라이팅)** |
| 벡터(SVG) | 제한적 | 후처리 필요 | **자동 변환 + 에디터** |
| 로고 특화 | 제한 | 낮음 | **배경 투명/소색상/심볼+워드마크** |
| 패키지화 | 일부 | 낮음 | **브랜드 키트 + 템플릿** |
| 협업/버전 | 일부 | 낮음 | **버전 히스토리 + 공유** |

---

## 4. 핵심 기능 (PRD)

1) **아이콘·로고 생성**
- 프롬프트 입력 → **리라이팅**(톤/스타일/제약 자동 추가)
- 스타일 프리셋: Minimal/Flat/Gradient/Retro/3D/Hand‑drawn
- 제약: **배경 투명**, 색상 1~3 제한(선택), 워드마크 포함 여부

2) **SVG 변환 & 편집**
- PNG → **자동 벡터화**(potrace) → **svgo 최적화**
- 레이어별 색상 변경, 텍스트 편집(폰트/커닝/자간), 도형 스냅/정렬
- 아이콘 사이즈 프리셋(16/24/48/64/128/256/512)

3) **브랜드 키트**
- 팔레트(Primary/Secondary/Accent), 로고 변형(가로/세로/모노), 보호 공간/가이드
- 파비콘/앱 아이콘/소셜 프로필/배너 자동 리사이즈

4) **다운로드 & 공유**
- PNG/SVG/PDF/WebP, 해상도 프리셋, 배경색 커스텀
- 공유 링크(읽기 전용), 피드백 코멘트

5) **관리 & 마켓**
- 공개 갤러리(선택), 테마 큐레이션, 템플릿 스토어(추가 과금)

---

## 5. 사용자 여정 (UX Flow)

1. 온보딩(산업/무드/키워드/색상) → 2. 자동 리라이팅 확인 → 3. 시안 생성(2~6장)  
4. 선호도 선택(좋아요/보류/제외) → 5. SVG 변환 → 6. 색/텍스트/레이아웃 편집  
7. 브랜드 키트 생성 → 8. 다운로드/공유/마켓 등록(선택)

---

## 6. 가격/정책

- **Free**: 월 3회 생성, 워터마크 PNG 다운로드
- **Pro(₩Y/월)**: 무제한 생성, 상업 라이선스, SVG/PDF, 브랜드 키트
- **Credits**: 20장/₩X (비구독형)
- **B2B**: 팀 좌석/작업공간, SSO, 대량 생성

정책
- 상업 사용 가능(사용자 보유), 단 **타 브랜드/인물/저작물 모방 금지**
- 신고/모더레이션 플로우(임시 비공개, 이의 제기)

---

## 7. 운영 기준

- **SLA**: 이미지 생성 95% 40초 이내, SVG 변환 95% 10초 이내
- **CS**: 자동 환불(실패/중복 결제), 분쟁 처리 72시간 이내
- **모니터링**: 생성 성공률, 비용/이미지, 활성 구독, 전환율, 재방문율

---

## 8. 로드맵

- **MVP(4주)**: 생성(리라이팅/PNG) → SVG 변환/편집(기본) → 다운로드 → 결제
- **M2(4주)**: 브랜드 키트/템플릿, 협업/공유, 갤러리
- **M3(4주)**: 마켓/서드파티 템플릿, 팀 좌석/워크스페이스, 에셋 라이브러리

---

## 9. 리스크 & 대응
- **저작권/상표**: 금지 키워드 필터, 유사도 검사(선행 검색 API 검토), 신고/임시차단
- **비용 급증**: 크레딧/쿨다운/배치 생성, 실패 재시도 제한, 캐시
- **품질 편차**: 프롬프트 템플릿 지속 개선, 사용자 피드백 루프, A/B 테스트
- **모델 변화**: 모델 버전 플래그, 출력 회귀 테스트

---

## 10. 개발 기획서 (Implementation Plan)

### 10.1 아키텍처
- **FE**: Next.js(App Router, TS), Tailwind + shadcn/ui, Zustand
- **BE**: Next.js API Routes, Node 20, OpenAI SDK
- **AI**: GPT‑4o(text) for rewriting, **gpt-image-1** for image
- **이미지 파이프라인**: Sharp(정규화) → **potrace**(벡터화) → **svgo**(최적화)
- **스토리지/CDN**: S3 + CloudFront(썸네일/다운로드), Presigned URL
- **DB**: PostgreSQL + Prisma, **Redis**(rate limit, queue)
- **결제**: Stripe Checkout + Webhook
- **배포**: Vercel(웹) + AWS Lambda(백그라운드 작업 선택)

### 10.2 주요 API
| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/api/prompt/rewrite` | 사용자 입력 → 리라이팅 텍스트 생성 |
| POST | `/api/logo/generate` | gpt-image-1 호출, PNG(투명) 생성 |
| POST | `/api/logo/vectorize` | PNG → SVG(potrace) → svgo |
| POST | `/api/logo/variations` | delta 기반 재생성/버전 추가 |
| GET  | `/api/artworks/:id` | 아트워크 조회(버전/메타 포함) |
| POST | `/api/artworks/:id/publish` | 공개/비공개 전환 |
| POST | `/api/payment/session` | Stripe 세션 생성 |
| POST | `/api/webhooks/stripe` | 결제 이벤트 처리 |

### 10.3 데이터 모델(요약)
- **User(id, email, role, plan, credits, createdAt)**
- **Artwork(id, ownerId, prompt, promptRewritten, pngUrl, svgUrl, palette, createdAt)**
- **ArtworkVersion(id, artworkId, delta, pngUrl, svgUrl, createdAt)**
- **BrandKit(id, artworkId, colors[], fonts[], rules, assets[])**
- **Order(id, userId, type[credits/subscription], amount, status, createdAt)**

### 10.4 프롬프트 리라이팅 템플릿(예)
- Input: `{brand}:{keywords},{mood},{industry},{colors}`  
- Output(영문):  
  “**Flat vector‑style logo** for a `{industry}` brand named `{brand}`; **2 colors** `{colors}`; **transparent background**; **minimal shapes**; **no photo textures**; **high contrast**; **clean geometry**.”

### 10.5 성능·안정화
- Rate limit: user 30 req/hour, ip 60 req/hour
- 재시도: 3회 백오프, 실패 로그 적재
- 큐 처리: BullMQ(벡터화/최적화/대량 생성)

### 10.6 보안/컴플라이언스
- 입력 검증(XSS/프로프트 인젝션 방지), 민감 키워드 차단
- S3 private + presigned, 서명 만료 5분
- GDPR/개인정보: 최소 수집, 삭제 요청 대응

### 10.7 QA 수락 기준(샘플)
- 1024×1024 투명 PNG 성공률 **≥ 98%**
- SVG 변환 실패율 **≤ 2%**
- 색상 변경/텍스트 편집 **100% 반영**
- 결제 후 크레딧/구독 상태 **즉시 갱신**

---

## 11. 용어
- **프롬프트 리라이팅**: AI가 생성 품질을 높이도록 입력을 자동 보정
- **벡터화(potrace)**: 래스터 이미지를 곡선/경로로 변환해 확대에 강함
- **svgo**: SVG 파일 구조/경로를 경량화하는 최적화 도구

---

## 12. 참고 링크
- Generate images with GPT Image: https://cookbook.openai.com/examples/generate_images_with_gpt_image  
- Introduction to GPT‑4o: https://cookbook.openai.com/examples/gpt4o/introduction_to_gpt4o  
- Tag & Caption Images with GPT‑4o mini: https://cookbook.openai.com/examples/tag_caption_images_with_gpt4v  

