import { Work } from "@/types/work";
import { sortByRecency } from "@/utils/works";

const entries: Work[] = [
    {
        slug: "suhan.io",
        title: "suhan.io",
        description: "마크다운 글 작성과 태그, 댓글, 동적 OG 이미지 생성을 지원하는 개인 블로그입니다.",
        stack: ["Next.js", "TypeScript", "Supabase"],
        startedAt: "2025-07-12",
        endedAt: null,
        href: "https://github.com/chemistryx/suhan.io"
    },
    {
        slug: "meoknaeng",
        title: "뭐해먹냉",
        description: "냉장고에 있는 재료로 만들 수 있는 요리를 AI가 추천해주는 서비스입니다.",
        stack: ["React", "FastAPI", "MySQL", "Gemini"],
        role: "Frontend",
        startedAt: "2026-05-04",
        endedAt: "2026-06-08",
        href: "https://github.com/sejong-oss/meoknaeng"
    },
    {
        slug: "agentic-judge",
        title: "agentic-judge",
        description: "코드를 직접 짜는 대신 AI 에이전트를 지휘하는 능력을 채점하는 코딩 문제은행입니다.",
        stack: ["React", "FastAPI", "Docker", "Local LLM"],
        award: { competition: "2026년 제 14회 세종대 AI·SW 해커톤", prize: "최우수상" },
        startedAt: "2026-06-24",
        endedAt: "2026-06-25",
        href: "https://github.com/parapara-till-prize/agentic-judge"
    },
    {
        slug: "sw4booth",
        title: "소웨네컷",
        description: "촬영한 사진을 AI로 캐릭터화하고 인쇄까지 처리하는 웹 기반 4컷 포토부스입니다.",
        stack: ["React", "TypeScript", "Fastify", "Gemini"],
        award: { competition: "2026년 가치확산 SW·AI 체험프로그램 공모전", prize: "우수상" },
        startedAt: "2025-10-27",
        endedAt: "2026-05-05",
        href: "https://github.com/sw4booth"
    },
    {
        slug: "sjpt-rest-client-poc",
        title: "sjpt-rest-client-poc",
        description: "세종대학교 포털을 REST 클라이언트로 다루기 위한 PoC 프로젝트입니다.",
        stack: ["Java"],
        startedAt: "2026-03-29",
        endedAt: "2026-03-29",
        href: "https://github.com/chemistryx/sjpt-rest-client-poc"
    },
    {
        slug: "rokaf-letter",
        title: "rokaf-letter",
        description: "공군 인터넷 편지 작성 절차를 간략하게 만들어주는 웹 서비스입니다.",
        stack: ["Next.js", "React", "TypeScript"],
        startedAt: "2023-05-16",
        endedAt: "2023-05-23",
        href: "https://github.com/chemistryx/rokaf-letter"
    },
    {
        slug: "fries",
        title: "FRIES",
        description: "채팅으로 일일이 처리하던 출석을 얼굴 인식으로 대체하고, 익명 질의응답까지 더한 대형 온라인 강의 자동 출석 시스템입니다.",
        stack: ["React", "SWR", "Spring Boot", "OpenCV"],
        role: "Frontend",
        award: { competition: "2025년 제 12회 세종대 SW·AI 해커톤", prize: "우수상" },
        startedAt: "2025-06-25",
        endedAt: "2025-06-26",
        href: null
    },
    {
        slug: "duriseo",
        title: "온밥",
        description: "가게가 기부한 식권으로 사회적 약자가 무료로 식사할 수 있게 도와주는 플랫폼입니다.",
        stack: ["Next.js", "TypeScript", "Spring Boot", "MySQL"],
        role: "Frontend",
        startedAt: "2025-04-30",
        endedAt: "2025-05-10",
        href: "https://github.com/duriseo"
    },
    {
        slug: "hyde",
        title: "hyde",
        description: "게시물과 태그 관리, 댓글 기능을 갖춘 Jekyll 기반 개인 블로그 / 포트폴리오 템플릿입니다.",
        stack: ["SCSS", "HTML"],
        startedAt: "2020-02-16",
        endedAt: "2023-09-24",
        href: "https://github.com/chemistryx/hyde"
    },
    {
        slug: "self-diagnosis-ios-shortcuts",
        title: "self-diagnosis-ios-shortcuts",
        description: "매일 반복하던 건강상태 자가진단을 자동으로 처리해주는 단축어입니다.",
        stack: ["iOS 단축어"],
        startedAt: "2020-09-08",
        endedAt: "2022-09-01",
        href: "https://github.com/chemistryx/self-diagnosis-ios-shortcuts"
    },
    {
        slug: "gwacheonhs-app",
        title: "gwacheonhs-app",
        description: "학교 생활에 필요한 정보를 한곳에서 확인할 수 있는 과천고등학교 학생용 애플리케이션입니다.",
        stack: ["Flutter", "Dart"],
        startedAt: "2020-02-28",
        endedAt: "2020-11-07",
        href: "https://github.com/chemistryx/gwacheonhs-app"
    },
    {
        slug: "gwacheonhs-api",
        title: "gwacheonhs-api",
        description: "과천고등학교의 학사 정보를 REST API로 제공하는 서비스입니다.",
        stack: ["Ruby"],
        startedAt: "2020-02-27",
        endedAt: "2020-10-25",
        href: "https://github.com/chemistryx/gwacheonhs-api"
    },
    {
        slug: "neis-api",
        title: "neis-api",
        description: "나이스 학생서비스 페이지를 파싱하여 JSON API로 제공하는 서비스입니다.",
        stack: ["Ruby"],
        startedAt: "2020-02-02",
        endedAt: "2020-11-13",
        href: "https://github.com/chemistryx/neis-api"
    }
];

export const works = sortByRecency(entries);
