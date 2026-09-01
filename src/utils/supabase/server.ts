import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            // A Server Component cannot write cookies, so a token refreshed
            // mid-render throws here and takes the query it was serving down
            // with it. The proxy refreshes the session before the render and
            // hands the fresh token to it, so there is nothing left to save.
            setAll: (cookiesToSet) => {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                } catch {
                    // Server Component render: the proxy already stored these.
                }
            }
        }
    });
}
