import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase pauses a free project after about a week without API requests, and
 * a paused project leaves the blog rendering an empty list rather than an
 * error. Visitor traffic is not a reliable heartbeat: / and /works read nothing
 * from Supabase, so a week of front-page visits alone would still let it pause.
 * One cheap read a day from the cron in vercel.json is what keeps it awake.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;

    // Missing secret is a 500 rather than a 401: every run would be rejected,
    // and a silent 401 forever is exactly the failure this route exists to
    // prevent. Better that the first run says why in the cron log.
    if (!secret) {
        console.error("keepalive: CRON_SECRET is not set");
        return NextResponse.json({ ok: false, error: "CRON_SECRET is not set" }, { status: 500 });
    }

    // Vercel signs its cron requests with CRON_SECRET. Anyone else is turned
    // away so the route cannot be used to poke the database from outside.
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
        return new NextResponse(null, { status: 401 });
    }

    const supabase = await createClient();

    // A single published id: the smallest read that still goes through PostgREST
    // and the database, which is what the inactivity timer actually watches.
    const { error } = await supabase.from(RECORDS_TABLE_NAME).select("id").limit(1);

    // Failing loudly matters more than the response body. The cron log is the
    // only place a project on its way to pausing can show up before a visitor
    // finds the blog empty.
    if (error) {
        console.error("keepalive failed", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
