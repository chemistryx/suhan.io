import { NextRequest, NextResponse } from "next/server";
import { presignPut } from "@/lib/assets/r2";
import { isAuthor } from "@/lib/viewer";

const TYPES: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif"
};

const MAX_BYTES = 20 * 1024 * 1024;

// Returns a presigned R2 URL; the browser uploads the file there itself.
export async function POST(request: NextRequest) {
    if (!(await isAuthor())) return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });

    const baseUrl = process.env.ASSETS_BASE_URL?.replace(/\/$/, "");
    if (!baseUrl) {
        console.error("upload: ASSETS_BASE_URL is not set");
        return NextResponse.json({ error: "서버 설정 오류가 발생했습니다." }, { status: 500 });
    }

    const { type, size, hash } = await request.json().catch(() => ({}));

    const ext = TYPES[type];
    if (!ext) return NextResponse.json({ error: "지원하지 않는 이미지 형식입니다." }, { status: 400 });
    if (typeof size !== "number" || size > MAX_BYTES) return NextResponse.json({ error: "20MB 이하의 이미지만 올릴 수 있습니다." }, { status: 400 });
    if (typeof hash !== "string" || !/^[0-9a-f]{12}$/.test(hash)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

    // YYYY/MM/<first 12 hex of the file's sha256>.<ext>
    const now = new Date();
    const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${hash}.${ext}`;
    try {
        const upload = await presignPut(key, type);
        return NextResponse.json({ uploadUrl: upload.url, headers: upload.headers, url: `${baseUrl}/${key}` });
    } catch (e) {
        console.error("upload: presign failed", e);
        return NextResponse.json({ error: "이미지 업로드 중 오류가 발생했습니다." }, { status: 500 });
    }
}
