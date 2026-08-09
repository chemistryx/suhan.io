import { format, parseISO } from "date-fns";
import { Work } from "@/types/work";

// An ongoing work has no end date, so treat it as the most recent.
function endedAtTime(work: Work) {
    return work.endedAt ? parseISO(work.endedAt).getTime() : Number.POSITIVE_INFINITY;
}

/**
 * Newest first, with ongoing works above finished ones. Ties — two works that
 * wrapped up the same day — fall back to whichever started later.
 */
export function sortByRecency(works: Work[]) {
    return [...works].sort((a, b) => {
        const [aEnd, bEnd] = [endedAtTime(a), endedAtTime(b)];

        // guarded so two ongoing works don't produce Infinity - Infinity
        if (aEnd !== bEnd) return bEnd - aEnd;

        return parseISO(b.startedAt).getTime() - parseISO(a.startedAt).getTime();
    });
}

/** "2023", "2020 – 2023", or "2025 – 현재" */
export function toPeriodString(work: Work) {
    const startedYear = format(parseISO(work.startedAt), "yyyy");

    if (!work.endedAt) return `${startedYear} – 현재`;

    const endedYear = format(parseISO(work.endedAt), "yyyy");

    return startedYear === endedYear ? startedYear : `${startedYear} – ${endedYear}`;
}
