import "server-only";
import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "./auth/session";

// Single-author site: a valid session means author.
export const isAuthor = async () => {
    const cookieStore = await cookies();

    return Boolean(await readSession(cookieStore.get(SESSION_COOKIE)?.value));
};
