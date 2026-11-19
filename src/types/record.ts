import { Category } from "./category";
import { Tag } from "./tag";

/** Stored form. */
export type RecordDoc = {
    id: number;
    slug: string;
    title: string;
    description: string;
    // category slug
    category: string | null;
    // tag names
    tags: string[];
    published: boolean;
    created_at: string;
    updated_at: string;
    content: string;
};

/** Rendered form, with category and tags resolved. */
export type Record = Omit<RecordDoc, "category" | "tags"> & {
    category: Category | null;
    tags: Tag[];
};

export type RecordSummary = Omit<Record, "content">;

export type AdjacentRecords = {
    previous: Pick<Record, "title" | "slug"> | null;
    next: Pick<Record, "title" | "slug"> | null;
};
