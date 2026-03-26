# 토닥토닥 (Todak-Todak) — Frontend

> 하루 두 번, 위로와 응원의 글귀를 이메일로 전달하는 구독 서비스의 프론트엔드입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Charts | Recharts |
| Auth | Magic Link (Passwordless) |

---

## 주요 기능

### 페이지별 기능 설명

#### 홈 (`/`)
- 오늘의 글귀 카드 표시 (QuoteCard 컴포넌트)
- 비로그인 유저에게 구독/로그인 유도 UI

#### 갤러리 (`/gallery`)
- 6가지 카테고리 필터 (CategoryFilter 컴포넌트)
- 페이지네이션 (윈도우 10개 제한)
- 로그인 유저: 글귀 좋아요 / 저장 토글 가능

#### 저장함 (`/saved`)
- 로그인 유저 전용
- 내가 저장한 글귀 목록 표시

#### AI 글귀 생성 (`/ai`)
- 상황 설명 + 카테고리 입력 → Claude AI가 맞춤 글귀 생성
- 로그인 유저 전용

#### 구독 신청 (`/subscribe`)
- 이메일 / 이름 / 선호 카테고리 선택 후 구독 신청
- 신청 후 이메일 인증 안내

#### 이메일 인증 (`/subscribe/verify`)
- URL 파라미터의 인증 토큰 처리
- 인증 성공 시 구독 `ACTIVE` 상태 전환

#### 로그인 (`/login`)
- 이메일 입력 → Magic Link 발송 요청
- MagicLinkModal 컴포넌트로 발송 완료 안내

#### 인증 콜백 (`/auth/callback`)
- Magic Link 클릭 후 리다이렉트되는 페이지
- JWT 토큰 수신 → localStorage 저장 → 이전 페이지 복귀

#### 마이페이지 (`/mypage`)
- 구독 정보 확인 (이메일, 이름, 상태)
- 선호 카테고리 변경
- 구독 취소

#### 어드민 (`/admin`)
- 어드민 권한 유저 전용
- 전체 통계 (구독자 수, 발송 횟수 등) — Recharts 차트
- 구독자 목록 테이블 (페이지네이션)
- 발송 이력 테이블

---

## 인증 방식

**Passwordless Magic Link** 방식:

```
1. 유저가 이메일 입력
2. 백엔드가 15분 유효 Magic Link 발송
3. 유저가 이메일 링크 클릭
4. /auth/callback 페이지에서 JWT 수신
5. localStorage에 저장 → 이후 모든 API 요청에 자동 첨부
```

localStorage 저장 키:

| 키 | 설명 |
|----|------|
| `ongi_access_token` | JWT 액세스 토큰 |
| `ongi_subscriber_id` | 구독자 ID |
| `ongi_email` | 이메일 |
| `ongi_return_to` | 로그인 후 복귀 경로 |

---

## 카테고리

| 값 | 한국어 |
|----|--------|
| `COMFORT` | 위로 |
| `CHEER` | 응원 |
| `ENCOURAGE` | 격려 |
| `SUPPORT` | 지지 |
| `CELEBRATE` | 축하 |
| `LOVE` | 사랑 |

---

## 환경변수

<!-- AUTO-GENERATED -->
| 변수 | 필수 | 설명 | 예시 |
|------|------|------|------|
| `NEXT_PUBLIC_API_URL` | Yes | 백엔드 API 기본 URL | `http://localhost:8080` |
<!-- AUTO-GENERATED -->

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 스크립트

<!-- AUTO-GENERATED -->
| 커맨드 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (hot reload) |
| `npm run build` | 프로덕션 빌드 (타입 체크 포함) |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 실행 |
<!-- AUTO-GENERATED -->

---

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local  # 또는 직접 생성
# NEXT_PUBLIC_API_URL=http://localhost:8080

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

---

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── page.tsx                # 홈 — 오늘의 글귀
│   ├── layout.tsx              # 루트 레이아웃
│   ├── gallery/page.tsx        # 갤러리 (카테고리 필터 + 페이지네이션)
│   ├── saved/page.tsx          # 저장함 (인증 필요)
│   ├── ai/page.tsx             # AI 글귀 생성 (인증 필요)
│   ├── subscribe/
│   │   ├── page.tsx            # 구독 신청
│   │   └── verify/page.tsx     # 이메일 인증 콜백
│   ├── login/page.tsx          # Magic Link 로그인
│   ├── auth/callback/page.tsx  # JWT 수신 콜백
│   ├── mypage/page.tsx         # 마이페이지
│   └── admin/page.tsx          # 어드민 대시보드
├── components/                 # 공유 UI 컴포넌트
│   ├── QuoteCard.tsx           # 글귀 카드 (좋아요/저장 버튼 포함)
│   ├── GalleryGrid.tsx         # 갤러리 그리드
│   ├── CategoryFilter.tsx      # 카테고리 필터 버튼
│   ├── Header.tsx              # 공통 헤더 (로그인 상태 반영)
│   ├── MagicLinkModal.tsx      # Magic Link 발송 완료 모달
│   ├── SkeletonCard.tsx        # 로딩 스켈레톤
│   ├── Providers.tsx           # Context Provider 래퍼
│   └── icons.tsx               # SVG 아이콘 모음
├── contexts/
│   └── AuthContext.tsx         # JWT 인증 상태 관리
├── hooks/
│   └── useSubscribe.ts         # 구독 신청 훅
├── lib/
│   ├── api.ts                  # 공개 API 클라이언트 (quoteApi, subscriberApi, authApi)
│   ├── adminApi.ts             # 어드민 API 클라이언트
│   └── auth.ts                 # localStorage 토큰 헬퍼
└── types/
    ├── index.ts                # 공유 타입 (Quote, Category, ApiResponse 등)
    └── admin.ts                # 어드민 전용 타입
```

---

## API 클라이언트 구조

`src/lib/api.ts` — Base URL: `NEXT_PUBLIC_API_URL/api/v1`

```ts
quoteApi.getToday()                          // 오늘의 글귀
quoteApi.getByCategory(category, page, size) // 카테고리별 목록
quoteApi.getSaved()                          // 내 저장 글귀
quoteApi.toggleLike(quoteId)                 // 좋아요 토글
quoteApi.toggleSave(quoteId)                 // 저장 토글
quoteApi.generateAI(data)                    // AI 글귀 생성

subscriberApi.subscribe(data)                // 구독 신청
subscriberApi.verify(token)                  // 이메일 인증
subscriberApi.unsubscribe(email)             // 구독 취소
subscriberApi.getMe()                        // 내 정보
subscriberApi.updatePreferences(categories)  // 선호 카테고리 변경

authApi.sendMagicLink(email)                 // 매직 링크 발송
authApi.verifyMagicLink(token)               // 토큰 검증 → JWT
```

`src/lib/adminApi.ts` — Base URL: `NEXT_PUBLIC_API_URL/api/v1/admin`

```ts
adminApiClient.getStats()                    // 통계
adminApiClient.getSubscribers(page, size)    // 구독자 목록
adminApiClient.getSendHistory(page, size)    // 발송 이력
```

---

## 관련 레포지토리

- **Backend**: [ongi-be](https://github.com/) — Spring Boot 4 + Java 21 + MySQL + Redis + Kafka
