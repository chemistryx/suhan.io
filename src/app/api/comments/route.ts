import { after, NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/comments/password";
import { insertComment, listComments } from "@/lib/comments/store";
import { errorResponse } from "@/lib/http";
import { findVisibleRecord } from "@/lib/records";
import { notifyNewComment } from "@/lib/mail/comment-notification";
import { isAuthor } from "@/lib/viewer";
import { siteConfig } from "@/site.config";

const MAX_NAME = 30;
const MAX_CONTENT = 2000;

export async function GET(request: NextRequest) {
    const recordId = Number(request.nextUrl.searchParams.get("recordId"));

    try {
        if (!(await findVisibleRecord(recordId))) return errorResponse("기록을 찾을 수 없습니다.", 404);
        return NextResponse.json({ comments: await listComments(recordId) });
    } catch (e) {
        console.error("comments list failed", e);
        return errorResponse("댓글을 불러오는 중 오류가 발생했습니다.", 500);
    }
}

export async function POST(request: NextRequest) {
    const { recordId, authorName, content, password } = await request.json().catch(() => ({}));

    const text = typeof content === "string" ? content.trim() : "";
    if (!text || text.length > MAX_CONTENT) return errorResponse(`내용은 1~${MAX_CONTENT}자로 입력해주세요.`, 400);

    try {
        const author = await isAuthor();
        const record = await findVisibleRecord(Number(recordId));
        if (!record) return errorResponse("기록을 찾을 수 없습니다.", 404);

        // The author's comments are tied to the session; everyone else's to a password.
        const name = author ? siteConfig.author.name : typeof authorName === "string" ? authorName.trim() : "";
        if (!name || name.length > MAX_NAME) return errorResponse(`이름은 1~${MAX_NAME}자로 입력해주세요.`, 400);
        if (!author && (typeof password !== "string" || !password)) return errorResponse("비밀번호를 입력해주세요.", 400);

        const comment = await insertComment({
            recordId: Number(recordId),
            authorName: name,
            content: text,
            passwordHash: author ? null : await hashPassword(password),
            isAuthor: author
        });

        // Notify after responding, so a slow or failing mail never holds up the comment.
        if (!author) after(() => notifyNewComment(comment, record).catch((e) => console.error("comment mail failed", e)));

        return NextResponse.json({ comment }, { status: 201 });
    } catch (e) {
        console.error("comment create failed", e);
        return errorResponse("댓글 등록 중 오류가 발생했습니다.", 500);
    }
}
