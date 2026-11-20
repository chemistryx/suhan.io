[English](README.md) | 한국어
# suhan.io
Markdown 기반의 개인 블로그 애플리케이션입니다.

글은 GitHub 저장소에 파일로 저장되며, 웹 에디터를 통해 작성할 수 있습니다.

> [!NOTE]
> 이 저장소는 개인 [블로그](https://suhan.io)에 사용 중입니다.\
> 다른 환경에서 사용하려면 `src/site.config.ts`의 사이트 정보와 환경 변수를 수정해야 합니다.

## 기능
* 웹 에디터를 통한 Markdown 글 작성 및 GitHub 저장소 커밋
* 초안, 카테고리, 태그 관리
* GitHub 계정을 통한 작성자 인증
* Cloudflare R2를 통한 이미지 업로드 및 미사용 이미지 자동 삭제
* 작성자 및 익명 사용자 댓글 작성
* 새 댓글 작성 시 작성자에게 이메일 알림
* SEO 최적화, sitemap 및 동적 OpenGraph 이미지 생성

## 기술 스택
* 프레임워크: Next.js (App Router)
* 글 저장소: GitHub
* 이미지 저장소: Cloudflare R2
* 데이터베이스: Cloudflare D1
* 이메일 알림: Resend
* 배포: Vercel

## 시작하기
### 1. 저장소 복제 및 의존성 설치
```bash
$ git clone https://github.com/chemistryx/suhan.io.git
$ cd suhan.io/
$ npm install
```

### 2. 외부 서비스 설정
#### 글 저장소
1. 글을 저장할 private GitHub 저장소를 생성합니다.
2. 해당 저장소에 대해 Contents 읽기 및 쓰기 권한을 가진 [fine-grained 토큰](https://github.com/settings/personal-access-tokens)을 발급합니다.

#### 인증
1. [GitHub App](https://github.com/settings/apps/new)을 생성하고, Callback URL에 다음 주소를 등록합니다.
    * `http://localhost:3000/api/auth/callback`
    * `https://<도메인>/api/auth/callback`
2. Webhook은 비활성화하고, 별도의 권한은 부여하지 않습니다.
3. Client ID를 확인하고 client secret을 발급합니다.

로그인은 글 저장소 소유자의 GitHub 계정으로만 가능합니다.

#### 이미지
1. Cloudflare R2 버킷을 생성하고 커스텀 도메인을 연결합니다.
2. 해당 버킷에 대해 Object Read & Write 권한을 가진 R2 API 토큰을 발급합니다.
3. 브라우저에서 이미지를 업로드할 수 있도록 버킷에 다음 CORS 정책을 추가합니다.
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://<도메인>"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type", "cache-control"],
    "MaxAgeSeconds": 3600
  }
]
```

#### 댓글
1. Cloudflare D1 데이터베이스를 생성합니다.
2. D1 Edit 권한을 가진 Cloudflare API 토큰을 발급합니다.
3. 다음 명령어로 테이블을 생성합니다.
```bash
$ npx wrangler d1 execute <데이터베이스 이름> --remote --file=db/schema.sql
```

#### 이메일 알림
[Resend](https://resend.com)에서 도메인을 인증한 후 API 키를 발급합니다.

### 3. 환경 변수 설정
1. 프로젝트 루트 경로에 `.env.local` 파일을 생성합니다.
2. `.env.sample`의 내용을 복사하여 `.env.local`에 붙여넣은 후, 2단계에서 준비한 값을 입력합니다.

`AUTHOR_GITHUB_LOGIN`, `MAIL_FROM`, `MAIL_TO`와 검색엔진 인증 코드는 선택 항목입니다. 값이 비어 있으면 다른 환경 변수를 기준으로 기본값이 지정됩니다.

단, 로컬 환경에서는 `MAIL_FROM`의 기본값을 지정할 수 없으므로 이메일 알림을 확인하려면 값을 입력해야 합니다.

### 4. 사이트 정보 수정
`src/site.config.ts`와 `src/app/page.tsx`의 소개 문구를 수정하고, `public/profile.png`와 `src/data/works.ts`를 교체합니다.

### 5. 로컬 실행
```bash
$ npm run dev
```

## 글 파일 형식
각 글은 글 저장소 루트 경로에 `<slug>.md` 형식으로 저장됩니다.

slug는 제목을 기준으로 생성되며, frontmatter는 에디터에서 자동으로 작성됩니다.
```markdown
---
id: 1
title: "글 제목"
description: "글 설명"
category: "backend"
tags: ["Next.js", "TypeScript"]
published: true
created_at: "2026-01-01T00:00:00.000Z"
updated_at: "2026-01-01T00:00:00.000Z"
---

본문
```
* `id`는 글과 댓글을 연결하는 값으로, 제목이 변경되어도 유지됩니다.
* `category`에는 `src/constants.ts`의 `CATEGORIES`에 정의된 slug를 사용합니다.
* `published`가 `false`인 글은 로그인한 작성자에게만 표시됩니다.

## 배포
Vercel에 배포한 후 `.env.sample`의 환경 변수를 추가합니다. 토큰과 secret 값은 Sensitive로 지정합니다.

`vercel.json`에는 미사용 이미지를 삭제하는 cron 작업이 등록되어 있습니다.

이 작업은 매일 한 번 실행되며, 업로드 후 일주일이 지났지만 아무 글에서도 사용되지 않는 이미지를 삭제합니다.

Vercel은 `CRON_SECRET` 환경 변수를 통해 이 요청을 인증합니다.

## 라이선스
[MIT License](LICENSE)
