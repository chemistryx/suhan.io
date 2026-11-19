import "server-only";
import { Comment } from "@/types/comment";
import { query } from "./d1";

const COLUMNS = "id, record_id, author_name, content, is_author, created_at, updated_at";

type Row = Omit<Comment, "is_author"> & { is_author: number };

const toComment = (row: Row): Comment => ({ ...row, is_author: row.is_author === 1 });

export const listComments = async (recordId: number) =>
    (await query<Row>(`SELECT ${COLUMNS} FROM comments WHERE record_id = ? ORDER BY created_at, id`, [recordId])).map(toComment);

export const findComment = async (id: number) => {
    const [row] = await query<Row & { password_hash: string | null }>(`SELECT ${COLUMNS}, password_hash FROM comments WHERE id = ?`, [id]);
    return row ? { ...toComment(row), password_hash: row.password_hash } : null;
};

export const insertComment = async (comment: { recordId: number; authorName: string; content: string; passwordHash: string | null; isAuthor: boolean }) => {
    const [row] = await query<Row>(
        `INSERT INTO comments (record_id, author_name, content, password_hash, is_author) VALUES (?, ?, ?, ?, ?) RETURNING ${COLUMNS}`,
        [comment.recordId, comment.authorName, comment.content, comment.passwordHash, comment.isAuthor ? 1 : 0]
    );
    return toComment(row);
};

export const updateComment = (id: number, content: string) =>
    query("UPDATE comments SET content = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?", [content, id]);

export const deleteComment = (id: number) => query("DELETE FROM comments WHERE id = ?", [id]);
