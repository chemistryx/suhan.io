import { format, parseISO } from "date-fns";
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
    if (!date) return "unknown";
    return format(parseISO(date), "PPP", { locale: ko });
}
