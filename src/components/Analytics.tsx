"use client"
import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// Only the production host is counted, so previews and localhost stay out.
const host = (() => {
    try {
        return new URL(process.env.NEXT_PUBLIC_BASEURL ?? "").hostname;
    } catch {
        return undefined;
    }
})();

const Analytics = () => {
    // Clicks on links that leave the site, including middle clicks.
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!link || link.host === window.location.host || !/^https?:$/.test(link.protocol)) return;

            track("outbound-click", { url: link.href, page: window.location.pathname });
        };

        document.addEventListener("click", onClick, true);
        document.addEventListener("auxclick", onClick, true);
        return () => {
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("auxclick", onClick, true);
        };
    }, []);

    if (!websiteId || process.env.NODE_ENV !== "production") return null;

    return <Script src="https://cloud.umami.is/script.js" data-website-id={websiteId} data-domains={host} strategy="afterInteractive" />;
};

export default Analytics;
