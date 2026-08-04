"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Options {
    /** While true, leaving the page asks for confirmation. */
    enabled: boolean;
    /** Return true to allow the navigation, false to cancel it. */
    confirm: () => boolean;
}

/** Marks the throwaway history entry that absorbs the first Back press. */
const SENTINEL = "__navigationGuardSentinel";

/**
 * Warns before the user leaves a page with unsaved changes.
 *
 * The App Router has no routeChangeStart event, so each way out is covered
 * separately: beforeunload for the tab itself, a capture-phase click listener
 * for <Link>, a sentinel history entry for the Back button, and the returned
 * navigate() for router.push() calls made by this page.
 */
export function useNavigationGuard({ enabled, confirm }: Options) {
    const router = useRouter();
    const enabledRef = useRef(enabled);
    const confirmRef = useRef(confirm);

    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    useEffect(() => {
        confirmRef.current = confirm;
    });

    // Tab close, reload, and navigation to another origin.
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!enabledRef.current) return;

            // Browsers show their own wording, but Chrome still wants returnValue set.
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // <Link> clicks. Capture phase, so this runs before Next's own click handler.
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!enabledRef.current || event.defaultPrevented) return;
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = (event.target as Element | null)?.closest?.("a[href]");
            if (!(anchor instanceof HTMLAnchorElement)) return;
            if (anchor.hasAttribute("download")) return;
            if (anchor.target && anchor.target !== "_self") return;

            const url = new URL(anchor.href, location.href);
            // Another origin unloads the document, which beforeunload already covers.
            if (url.origin !== location.origin) return;
            // A bare hash change stays on the page.
            if (url.pathname === location.pathname && url.search === location.search) return;

            // window.confirm blocks, so on approval the event simply continues to
            // Next's handler and stays a client-side navigation.
            if (confirmRef.current()) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, []);

    // Browser Back. The sentinel entry absorbs the pop so the page can stay put.
    useEffect(() => {
        if (!enabled) return;

        const guardedUrl = location.pathname + location.search;
        // Next keeps its router state on history.state, so carry it over untouched.
        const pushSentinel = () => history.pushState({ ...history.state, [SENTINEL]: true }, "", location.href);
        let released = false;

        pushSentinel();

        const handlePopState = () => {
            // Landing back on the sentinel means the page was never actually left.
            if (history.state?.[SENTINEL]) return;
            // Clicking a fragment link fires popstate too, but it only moves within
            // the page, so it is not something to confirm.
            if (location.hash && location.pathname + location.search === guardedUrl) return;

            if (confirmRef.current()) {
                released = true;
                window.removeEventListener("popstate", handlePopState);
                history.back();
                return;
            }

            pushSentinel();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            // Drop the sentinel when the guard turns off while the page is still open.
            if (!released && history.state?.[SENTINEL]) history.back();
        };
    }, [enabled]);

    /** router.push() that asks first. */
    const navigate = useCallback((href: string) => {
        if (enabledRef.current && !confirmRef.current()) return;
        router.push(href);
    }, [router]);

    return { navigate };
}
