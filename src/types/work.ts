export interface Work {
    slug: string;
    title: string;
    description: string;
    stack: string[];
    startedAt: string;
    endedAt: string | null;
    href: string;
}
