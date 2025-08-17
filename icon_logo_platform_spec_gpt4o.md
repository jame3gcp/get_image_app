# 아이콘·로고 생성 플랫폼 --- 개발 중심 기능 명세서

*(Next.js + OpenAI GPT-4o 기반)*

------------------------------------------------------------------------

## 1. 기술 스택

-   **Frontend**
    -   Next.js (App Router, TypeScript)
    -   TailwindCSS + shadcn/ui
    -   React-svgmt / svgo (SVG 편집기)
    -   Zustand/Recoil (상태관리)
-   **Backend**
    -   Next.js API Routes (서버사이드 API)
    -   OpenAI GPT-4o (`gpt-image-1`) + GPT-4o-text (Prompt rewriting)
    -   Potrace / Sharp (PNG → SVG 변환, 이미지 처리)
    -   PostgreSQL + Prisma (DB ORM)
    -   Redis (세션/캐시/레이트 리밋)
-   **Infra**
    -   AWS S3 (파일 저장)
    -   CloudFront (이미지 CDN)
    -   Stripe (결제)
    -   Vercel (배포)

------------------------------------------------------------------------

## 2. 주요 기능별 요구사항

### A. 사용자 인증/권한

-   **NextAuth** 기반 OAuth2 (Google, GitHub, Email)
-   Role: `USER`, `PRO`, `ADMIN`
-   무료 사용자 → 월 3회 무료 생성\
-   Pro 사용자 → 무제한 생성 + 상업적 사용 라이선스 제공

------------------------------------------------------------------------

### B. 로고 생성 워크플로우

1.  **Prompt Rewriting**
    -   입력: `"강아지 로고"`
    -   GPT-4o-text 요청 →
        `"Flat vector-style logo of a friendly dog, minimal, 2 colors"`
    -   로그 저장 (원문, 리라이팅 결과)
2.  **이미지 생성 API**
    -   `POST /api/logo/generate`

    -   Request

        ``` json
        {
          "prompt": "Flat vector-style logo of a friendly dog",
          "style": "minimal",
          "color": "#ff6600",
          "transparent": true,
          "n": 2,
          "size": "1024x1024"
        }
        ```

    -   Response

        ``` json
        {
          "artworks": [
            { "id": "logo_123", "pngUrl": "https://cdn/logo123.png" }
          ]
        }
        ```
3.  **SVG 변환**
    -   `POST /api/logo/vectorize`

    -   Input: PNG 파일 → potrace로 변환 → SVGO 최적화

    -   Response

        ``` json
        {
          "svgUrl": "https://cdn/logo123.svg",
          "editableLayers": ["shape1", "shape2", "text"]
        }
        ```
4.  **버전 관리**
    -   모든 리롤/수정은 **ArtworkVersion** 테이블에 저장

    -   DB 스키마 예시:

        ``` prisma
        model Artwork {
          id        String   @id @default(cuid())
          ownerId   String
          prompt    String
          svgUrl    String?
          pngUrl    String
          createdAt DateTime @default(now())
          versions  ArtworkVersion[]
        }

        model ArtworkVersion {
          id        String   @id @default(cuid())
          artworkId String
          delta     String
          svgUrl    String?
          pngUrl    String?
          createdAt DateTime @default(now())
        }
        ```

------------------------------------------------------------------------

### C. 편집기 (SVG Editor)

-   **기능 요구사항**
    -   색상 변경 (HEX 입력)
    -   텍스트 편집 (폰트 교체, 크기)
    -   레이어 on/off
    -   미리보기 (Dark/Light theme mockup)
-   **기술**
    -   React-svgmt (실시간 조작)
    -   svgo (최적화 저장)

------------------------------------------------------------------------

### D. 갤러리/마켓플레이스

-   `/gallery`: 필터(스타일, 산업, 인기순)
-   `/artworks/[id]`: 상세 미리보기, 다운로드
-   `POST /api/artworks/:id/publish`: 공개/비공개 설정
-   공개 작품은 **마켓플레이스**에 노출, 구매 가능

------------------------------------------------------------------------

### E. 결제/과금

-   Stripe Checkout 세션
-   **상품 모델**
    -   `credits`: 20장 / ₩X
    -   `subscription`: Pro 월 ₩Y
-   API
    -   `POST /api/payment/session`
    -   Webhook → 주문 상태 업데이트

------------------------------------------------------------------------

### F. 관리자(Admin)

-   `/admin/dashboard`: 통계 (생성 수, 결제, 비용)
-   기능
    -   작품 검수 (저작권 이슈 → 비공개)
    -   사용자 제재 (차단, 크레딧 회수)
    -   프로모션/쿠폰 발행

------------------------------------------------------------------------

## 3. 비기능 요구사항

-   **성능**
    -   이미지 생성 요청 타임아웃: 60초
    -   CDN 캐시 → 썸네일 300ms 이내 로딩
-   **보안**
    -   S3 Presigned URL (다운로드 제한)
    -   프롬프트 입력 XSS 필터링
-   **안정성**
    -   API 실패 시 Retry(3회, exponential backoff)
    -   Job Queue (BullMQ) → SVG 변환/대용량 처리

------------------------------------------------------------------------

## 4. API 요약

  Method   Endpoint                      기능
  -------- ----------------------------- ---------------------------
  POST     `/api/logo/generate`          프롬프트 기반 PNG 생성
  POST     `/api/logo/vectorize`         PNG → SVG 변환
  POST     `/api/logo/variations`        기존 로고에서 변형 생성
  GET      `/api/artworks/:id`           작품 상세 조회
  POST     `/api/artworks/:id/publish`   갤러리에 공개/비공개 설정
  POST     `/api/payment/session`        Stripe 결제 세션 생성
  POST     `/api/webhooks/stripe`        결제 이벤트 처리
  GET      `/api/admin/reports`          관리자용 통계

------------------------------------------------------------------------

## 5. 초기 마일스톤 (예시)

-   **MVP (2주)**
    -   로고 생성 (프롬프트 → PNG)
    -   SVG 변환 및 다운로드
    -   마이페이지 + 크레딧 결제
-   **M2 (3주)**
    -   편집기 (SVG 컬러/텍스트 변경)
    -   갤러리 + 공개 공유
    -   관리자 대시보드
-   **M3 (2주)**
    -   마켓플레이스 (구매/판매)
    -   팀 협업(워크스페이스)
    -   소셜 미디어 키트 생성

------------------------------------------------------------------------

## 6. 참고 링크 (Cookbook)

-   [Generate images with GPT
    Image](https://cookbook.openai.com/examples/generate_images_with_gpt_image?utm_source=chatgpt.com)\
-   [Introduction to
    GPT-4o](https://cookbook.openai.com/examples/gpt4o/introduction_to_gpt4o?utm_source=chatgpt.com)\
-   [Tag & Caption Images with GPT-4o
    mini](https://cookbook.openai.com/examples/tag_caption_images_with_gpt4v?utm_source=chatgpt.com)
