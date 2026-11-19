import { NextRequest, NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/auth/session";

// Author-only pages render as not found for everyone else.
export async function proxy(request: NextRequest) {
    const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) return NextResponse.rewrite(new URL("/not-found", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/records/new", "/records/:slug/edit"]
};
