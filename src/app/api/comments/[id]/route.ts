import { NextRequest, NextResponse } from "next/server";
import { deleteComment, updateComment } from "@/lib/comments/store";
import { errorResponse } from "@/lib/http";
import { checkAccess } from "./access";

const MAX_CONTENT = 2000;

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
    const id = Number((await params).id);
    const { content, password } = await request.json().catch(() => ({}));

    const text = typeof content === "string" ? content.trim() : "";
    if (!text || text.length > MAX_CONTENT) return errorResponse(`내용은 1~${MAX_CONTENT}자로 입력해주세요.`, 400);

    try {
        const { comment, denied } = await checkAccess(id, "edit", password);
        if (!comment) return errorResponse("댓글을 찾을 수 없습니다.", 404);
        if (denied) return errorResponse(denied, 403);

        await updateComment(id, text);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("comment update failed", e);
        return errorResponse("댓글 수정 중 오류가 발생했습니다.", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const id = Number((await params).id);
    const { password } = await request.json().catch(() => ({}));

    try {
        const { comment, denied } = await checkAccess(id, "delete", password);
        if (!comment) return errorResponse("댓글을 찾을 수 없습니다.", 404);
        if (denied) return errorResponse(denied, 403);

        await deleteComment(id);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("comment delete failed", e);
        return errorResponse("댓글 삭제 중 오류가 발생했습니다.", 500);
    }
}
