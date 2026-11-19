import "server-only";

// Resend for now; swapping providers only touches this file.
export const sendMail = async (mail: { to: string; subject: string; html: string }) => {
    const key = process.env.RESEND_API_KEY;
    const base = process.env.NEXT_PUBLIC_BASEURL;
    const from = process.env.MAIL_FROM || (base && `noreply@${new URL(base).hostname}`);
    if (!key || !from) throw new Error("RESEND_API_KEY, or MAIL_FROM / NEXT_PUBLIC_BASEURL, is not set");

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, html: mail.html }),
        cache: "no-store"
    });

    if (!res.ok) throw new Error(`mail: ${res.status} ${await res.text()}`);
};
