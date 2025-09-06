[English](README.md) | 한국어
# suhan.io
개인 블로그 애플리케이션

## 기능
* Supabase Auth를 통한 사용자 인증
* Markdown 기반 동적 콘텐츠 작성 및 데이터베이스 저장
* Supabase Storage를 통한 이미지 업로드
* 기록 태그 시스템
* 작성자 및 익명 사용자 댓글 작성
* SEO 최적화 및 동적 OpenGraph 이미지 생성
* 새 댓글 작성 시 기록 작성자에게 이메일 알림

## 기술 스택
* 프론트엔드: Next.js
* 백엔드: Supabase
* 데이터베이스: PostgreSQL (Supabase)
* 배포: Vercel, Supabase
* 이메일 알림: Resend

## 시작하기
> [!NOTE]
> 이 저장소는 개인 [블로그](https://suhan.io)에 사용 중이며, **바로 사용하기에는 적합하지 않습니다.** 본인 프로젝트에 맞게 일부 수정이 필요합니다.

### 1. 저장소 복제
```bash
$ git clone https://github.com/chemistryx/suhan.io.git
$ cd suhan.io/
```
### 2. 의존성 설치
```bash
$ npm install
```
### 3. 환경 변수 설정
1. 프로젝트 루트 경로에 `.env.local` 파일을 생성합니다.
2. `.env.sample`의 내용을 복사하여 `.env.local`에 붙여넣고, 본인의 정보로 채웁니다.

### 4. 로컬 실행
```bash
$ npm run dev
```

## Supabase 설정
> 진행하기 전에 Supabase CLI가 설치 및 설정되어 있어야 합니다.

### 1. 데이터베이스
`supabase/migrations` 폴더에 있는 마이그레이션을 적용합니다:
```bash
$ supabase db push
```
위 명령으로 필요한 테이블(records, comments 등), 트리거, RLS 정책이 생성됩니다.

### 2. Edge Functions & Database Webhooks (선택)
댓글 작성 시 이메일 알림과 같은 기능을 활성화하려면 Edge Functions를 배포하고 Webhook을 설정합니다.

1. 시크릿 키 설정:
```bash
$ supabase secrets set RESEND_API_KEY=your_api_key
``` 
2. Functions 배포:
```bash
$ supabase functions deploy send-comment-mail
```
3. Database Webhooks 설정

    [Supabase Dashboard](https://supabase.com/dashboard)에서 다음 설정을 진행합니다:

    3.1. **Integrations > Database Webhooks**로 이동해 `Create a new hook` 버튼을 클릭합니다.\
    3.2. 프롬프트 창에서 다음 절차를 진행합니다:\
        - **General**: Webhook 이름 입력\
        - **Conditions to fire webhook**: `comments` 테이블 선택 후 Event Type을 **Insert**로 설정\
        - **Webhook configuration**: Webhook Type으로 `Supabase Edge Functions` 선택\
        - **Edge Function**: 이전에 배포한 Edge Function을 리스트에서 선택\
        - 나머지 옵션은 기본값 유지

## 라이선스
[MIT License](LICENSE)
