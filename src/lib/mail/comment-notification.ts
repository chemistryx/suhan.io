import "server-only";
import { Comment } from "@/types/comment";
import { sendMail } from "./send";

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const notifyNewComment = async (comment: Comment, record: { title: string; slug: string }) => {
    const to = process.env.MAIL_TO || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!to) return;

    const url = `${process.env.NEXT_PUBLIC_BASEURL}/records/${encodeURIComponent(record.slug)}`;

    await sendMail({
        to,
        subject: `[${record.title}] 새로운 댓글이 달렸습니다.`,
        html: `
            <p><strong>${escapeHtml(comment.author_name)}</strong>님이 댓글을 달았습니다.</p>
            <blockquote style="white-space: pre-wrap">${escapeHtml(comment.content)}</blockquote>
            <p><a href="${escapeHtml(url)}">${escapeHtml(record.title)}</a></p>
        `
    });
};
