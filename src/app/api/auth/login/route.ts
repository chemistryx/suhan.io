import { NextRequest, NextResponse } from "next/server";
import { STATE_COOKIE } from "@/lib/auth/session";

// Only same-site paths, so the redirect can't be used to send people elsewhere.
const safeNext = (next: string | null) => (next?.startsWith("/") && !next.startsWith("//") ? next : "/records");

export async function GET(request: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
        console.error("auth login: GITHUB_CLIENT_ID is not set");
        return NextResponse.redirect(new URL("/?auth=failed", request.url));
    }

    const state = crypto.randomUUID();
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", new URL("/api/auth/callback", request.url).toString());
    url.searchParams.set("state", state);
    url.searchParams.set("allow_signup", "false");

    const response = NextResponse.redirect(url);
    response.cookies.set(STATE_COOKIE, JSON.stringify({ state, next: safeNext(request.nextUrl.searchParams.get("next")) }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 600
    });

    return response;
}
