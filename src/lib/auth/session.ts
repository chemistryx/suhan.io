// Signed session cookie for the single author. Web Crypto, so it runs in the proxy too.

export const SESSION_COOKIE = "session";
export const STATE_COOKIE = "oauth_state";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

type Session = { login: string; exp: number };

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (value: string) =>
    Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const key = () => {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error("AUTH_SECRET is not set");

    return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
};

export const createSession = async (login: string) => {
    const payload = toBase64Url(encoder.encode(JSON.stringify({ login, exp: Date.now() + SESSION_MAX_AGE * 1000 })));
    const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await key(), encoder.encode(payload)));

    return `${payload}.${toBase64Url(signature)}`;
};

export const readSession = async (token?: string): Promise<Session | null> => {
    if (!token) return null;

    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    try {
        const valid = await crypto.subtle.verify("HMAC", await key(), fromBase64Url(signature), encoder.encode(payload));
        if (!valid) return null;

        const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Session;
        return session.exp > Date.now() ? session : null;
    } catch {
        return null;
    }
};
