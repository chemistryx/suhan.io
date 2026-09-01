import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// The author's own pages. Everything else behind the matcher is there for the
// session refresh alone and stays open to visitors.
const isAuthorOnly = (pathname: string) => pathname === "/records/new" || pathname.endsWith("/edit");

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
                // Onto the request as well as the response: the request copy is
                // what the render that follows reads, so without it the page
                // would still be working from the token that just expired.
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            }
        }
    });

    // Refreshing here is what keeps the pages under the matcher readable. This
    // is the only place the rotated cookies can be stored, and a page that
    // reads records on the server is unauthenticated until they are.
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && isAuthorOnly(request.nextUrl.pathname)) return NextResponse.rewrite(new URL("/not-found", request.url));

    return supabaseResponse;
}

// Every route that reads Supabase on the server. / and /works read nothing and
// stay out of it.
export const config = {
    matcher: ["/records/:path*", "/tags/:path*"]
};
