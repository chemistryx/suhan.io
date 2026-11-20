import "server-only";

// Checks a Turnstile token. Without TURNSTILE_SECRET_KEY (e.g. locally) the check is skipped.
export const verifyTurnstile = async (token: unknown, ip?: string | null) => {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true;
    if (typeof token !== "string" || !token) return false;

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, ...(ip && { remoteip: ip }) }),
        cache: "no-store"
    });
    const data = await res.json().catch(() => ({}));
    if (!data.success) console.error("turnstile rejected", data["error-codes"]);

    return data.success === true;
};
