"use client"
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

type TurnstileApi = {
    render: (el: HTMLElement, options: object) => string;
    remove: (id: string) => void;
};

declare global {
    interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptLoad: Promise<void> | null = null;

const loadScript = () => {
    scriptLoad ??= new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => { scriptLoad = null; reject(new Error("turnstile script failed")); };
        document.head.appendChild(script);
    });

    return scriptLoad;
};

interface Props {
    // Called with a token, or null once it expires or fails.
    onToken: (token: string | null) => void;
}

// Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
const Turnstile = ({ onToken }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useEffect(() => {
        if (!siteKey) return;

        let widgetId: string | undefined;
        let active = true;

        loadScript()
            .then(() => {
                if (!active || !ref.current || !window.turnstile) return;
                widgetId = window.turnstile.render(ref.current, {
                    sitekey: siteKey,
                    theme: "auto",
                    size: "flexible",
                    callback: (token: string) => onToken(token),
                    "expired-callback": () => onToken(null),
                    "error-callback": (code: string) => { track("turnstile-error", { code: String(code) }); onToken(null); }
                });
            })
            .catch(() => onToken(null));

        return () => {
            active = false;
            if (widgetId) window.turnstile?.remove(widgetId);
        };
    }, [siteKey, onToken]);

    return siteKey ? <div ref={ref} /> : null;
};

export default Turnstile;
