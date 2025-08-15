import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function normalize(title: string) {
    return title.toLowerCase().trim()
        .replace(/\s+/g, "-")              // replace blank to hyphen
        .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-z0-9\-]+/g, "")  // remove everything except korean, lowercase alphabet, numbers, hyphen
        .replace(/\-+/g, "-")              // do not allow continuous hyphen
        .replace(/^-+/, "")                // remove leading hyphen
        .replace(/-+$/, "");               // remove trailing hyphen
}

export function toDateString(date?: string) {
    if (!date) return "N/A";
    return format(parseISO(date), "PPP", { locale: ko });
}

export function toDateDistanceString(date?: string) {
    if (!date) return "N/A";
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export function generateNickname(excludeNames?: string[]) {
    const adjectives = [
        "호기심 많은", "디버깅하는", "코드 잘짜는", "커피 좋아하는", "배포 직전의", "빌드 실패한",
        "쿠키 굽는", "리팩토링 중인", "회의하는", "야근하는", "테스트케이스 작성하는", "문서화를 포기한",
        "스택오버플로우에 빠진", "함수 이름 고민하는", "코드 리뷰하는"
    ];

    const nouns = [
        "개발자", "디자이너", "엔지니어", "프로그래머", "기획자", "테스터",
        "대학원생", "외계인", "모험가", "마법사", "AI", "IDE",
        "강아지", "고양이", "토끼", "햄스터", "펭귄", "오리"
    ];

    let nickname = "";
    let attempts = 0;

    do {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        nickname = `${adj} ${noun}`;
        attempts += 1;
    } while (excludeNames?.includes(nickname) && attempts < 50);

    return nickname;
}
