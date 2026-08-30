export const AUTHOR_NAME_KO = "하수한";
export const AUTHOR_NAME_EN = "Suhan Ha";

export const META_TITLE = `${AUTHOR_NAME_KO} ${AUTHOR_NAME_EN}`;

export const RECORDS_TABLE_NAME = "records";
export const TAGS_TABLE_NAME = "tags";
export const RECORD_TAGS_TABLE_NAME = "record_tags";
export const COMMENTS_TABLE_NAME = "comments";

export const IMAGES_BUCKET_NAME = "images";

/**
 * Categories are a fixed, ordered set rather than a table: there are only a
 * handful, the sidebar needs them in a deliberate order, and the names have to
 * stay short enough for a ~130px column. Slugs are mirrored by a check
 * constraint on records.category.
 */
export const RECORD_CATEGORIES = [
    { slug: "backend", name: "백엔드" },
    { slug: "frontend", name: "프론트엔드" },
    { slug: "infra", name: "인프라" },
    { slug: "cs", name: "CS" }
] as const;

export type RecordCategory = typeof RECORD_CATEGORIES[number]["slug"];
