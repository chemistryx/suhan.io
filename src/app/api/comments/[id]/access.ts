import "server-only";
import { verifyPassword } from "@/lib/comments/password";
import { findComment } from "@/lib/comments/store";
import { isAuthor } from "@/lib/viewer";

// The author edits their own comments and may delete any; others need the comment's password.
export const checkAccess = async (id: number, action: "edit" | "delete", password: unknown) => {
    const comment = await findComment(id);
    if (!comment) return { comment: null, denied: null };

    // A password only ever decides an anonymous comment for a visitor.
    if (await isAuthor()) return { comment, denied: comment.is_author || action === "delete" ? null : "권한이 없습니다." };
    if (comment.is_author) return { comment, denied: "권한이 없습니다." };

    const ok = typeof password === "string" && (await verifyPassword(password, comment.password_hash));
    return { comment, denied: ok ? null : "비밀번호가 일치하지 않습니다." };
};
