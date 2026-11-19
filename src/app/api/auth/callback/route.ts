import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE, STATE_COOKIE } from "@/lib/auth/session";

const fail = (request: NextRequest, reason: string) => {
    console.error("auth callback:", reason);
    const response = NextResponse.redirect(new URL("/?auth=failed", request.url));
    response.cookies.delete({ name: STATE_COOKIE, path: "/api/auth" });

    return response;
};

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");

    let saved: { state: string; next: string };
    try {
        saved = JSON.parse(request.cookies.get(STATE_COOKIE)?.value ?? "");
    } catch {
        return fail(request, "missing state cookie");
    }
    if (!code || !state || state !== saved.state) return fail(request, "state mismatch");

    try {
        return await signIn(request, code, saved.next);
    } catch (e) {
        return fail(request, `GitHub request failed: ${e}`);
    }
}

const signIn = async (request: NextRequest, code: string, next: string) => {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: new URL("/api/auth/callback", request.url).toString()
        })
    });
    const { access_token: accessToken } = await tokenRes.json();
    if (!accessToken) return fail(request, "token exchange failed");

    const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" }
    });
    const { login } = await userRes.json();

    // The owner of the content repo is the author unless set otherwise.
    const author = process.env.AUTHOR_GITHUB_LOGIN || process.env.CONTENT_REPO?.split("/")[0];
    if (!author || typeof login !== "string" || login.toLowerCase() !== author.toLowerCase()) return fail(request, `not the author: ${login}`);

    const target = new URL(next, request.url);
    target.searchParams.set("auth", "success");
    const response = NextResponse.redirect(target);
    response.cookies.delete({ name: STATE_COOKIE, path: "/api/auth" });
    response.cookies.set(SESSION_COOKIE, await createSession(login), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE
    });

    return response;
};
