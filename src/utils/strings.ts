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
