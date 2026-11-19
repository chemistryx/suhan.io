import { NextRequest, NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/auth/session";

// Who is signed in, for client components.
export async function GET(request: NextRequest) {
    const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

    return NextResponse.json({ user: session ? { login: session.login } : null });
}

export async function DELETE() {
    const response = NextResponse.json({ user: null });
    response.cookies.delete(SESSION_COOKIE);

    return response;
}
