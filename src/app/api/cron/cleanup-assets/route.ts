import { NextRequest, NextResponse } from "next/server";
import { deleteObject, listObjects } from "@/lib/assets/r2";
import { readSnapshot } from "@/lib/content/store";

// Uploads younger than this survive, so an unsaved draft keeps its images.
const GRACE_MS = 7 * 24 * 60 * 60 * 1000;

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Daily: deletes R2 objects that no record (drafts included) links to. ?dry=1 only lists them.
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        console.error("cleanup: CRON_SECRET is not set");
        return NextResponse.json({ ok: false, error: "서버 설정 오류가 발생했습니다." }, { status: 500 });
    }
    if (request.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse(null, { status: 401 });

    const baseUrl = process.env.ASSETS_BASE_URL?.replace(/\/$/, "");
    if (!baseUrl) {
        console.error("cleanup: ASSETS_BASE_URL is not set");
        return NextResponse.json({ ok: false, error: "서버 설정 오류가 발생했습니다." }, { status: 500 });
    }

    try {
        return NextResponse.json(await cleanup(baseUrl, request.nextUrl.searchParams.has("dry")));
    } catch (e) {
        console.error("cleanup failed", e);
        return NextResponse.json({ ok: false, error: "이미지 정리 중 오류가 발생했습니다." }, { status: 500 });
    }
}

const cleanup = async (baseUrl: string, dry: boolean) => {
    const { records } = await readSnapshot();
    // An empty read would look like "nothing is referenced".
    if (!records.length) throw new Error("no records read");

    const pattern = new RegExp(`${escape(baseUrl)}/([^\\s)"'<>]+)`, "g");
    const referenced = new Set(records.flatMap((r) => [...r.content.matchAll(pattern)].map((m) => m[1])));

    const cutoff = Date.now() - GRACE_MS;
    const orphans = (await listObjects()).filter((o) => !referenced.has(o.key) && o.lastModified.getTime() < cutoff).map((o) => o.key);

    if (!dry) for (const key of orphans) await deleteObject(key);

    return { ok: true, dry, referenced: referenced.size, orphans, deleted: dry ? 0 : orphans.length };
};
