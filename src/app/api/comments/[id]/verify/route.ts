import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { checkAccess } from "../access";

// Checks a password before the edit form or delete dialog opens.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = Number((await params).id);
    const { password } = await request.json().catch(() => ({}));

    try {
        const { comment, denied } = await checkAccess(id, "edit", password);
        if (!comment) return errorResponse("댓글을 찾을 수 없습니다.", 404);
        if (denied) return errorResponse(denied, 403);

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("comment verify failed", e);
        return errorResponse("비밀번호 확인 중 오류가 발생했습니다.", 500);
    }
}
