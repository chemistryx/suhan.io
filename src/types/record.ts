import { RecordCategory } from "@/constants";

export type AdjacentRecords = {
    previous: Pick<Record, "id" | "title" | "slug"> | null;
    next: Pick<Record, "id" | "title" | "slug"> | null;
};

export type Record = {
    id: number;
    author_id: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    category: RecordCategory | null;
    published: boolean;
    created_at: string;
    updated_at: string;
};
