export type Comment = {
    id: number;
    record_id: number;
    author_name: string;
    content: string;
    // written by the signed-in site author
    is_author: boolean;
    created_at: string;
    updated_at: string;
};
