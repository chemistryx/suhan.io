import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = async (request: Request): Promise<Response> => {
    try {
        if (request.method !== "POST") return new Response(JSON.stringify({ status: false, message: "Method Not Allowed" }), { status: 405 });

        const { recordId, commentId } = await request.json();

        const { data: record, error: recordError } = await supabase
            .from("records")
            .select("title, author_id")
            .eq("id", recordId)
            .single();

        if (recordError) throw recordError;

        const { data: comment, error: commentError } = await supabase
            .from("comments")
            .select()
            .eq("id", commentId)
            .single();

        if (commentError) throw commentError;

        const { data: { user: user }, error: userError } = await supabase.auth.admin.getUserById(record.author_id);

        if (userError) throw userError;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: "noreply@suhan.io",
                to: [user.email],
                subject: `[${record.title}] 새로운 댓글이 달렸습니다.`,
                html: `
                    <h3>새로운 댓글</h3>
                    <p><strong>${comment.author_name}</strong>님이 댓글을 달았습니다.</p>
                    <blockquote>${comment.content}</blockquote>
                `
            })
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        let code = 500;
        let message = "Internal Server Error";

        if (e instanceof SyntaxError) {
            code = 400;
            message = "Bad Request";
        } else {
            console.error(e);
        }

        return new Response(JSON.stringify({ status: false, message }), { status: code });
    }
};

Deno.serve(handler);
