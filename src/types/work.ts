export interface Work {
    slug: string;
    title: string;
    description: string;
    stack: string[];
    role?: string;
    award?: { competition: string; prize: string };
    startedAt: string;
    endedAt: string | null;
    href: string | null;
}
