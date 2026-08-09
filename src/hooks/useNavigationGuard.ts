"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Options {
    /** While true, leaving the page asks for confirmation. */
    enabled: boolean;
}

/** The navigation that was held back while the confirmation is on screen. */
type PendingNavigation =
    | { type: "push"; href: string }
    | { type: "back" };

/** Marks the throwaway history entry that absorbs the first Back press. */
const SENTINEL = "__navigationGuardSentinel";

/**
 * Warns before the user leaves a page with unsaved changes.
 *
 * The App Router has no routeChangeStart event, so each way out is covered
 * separately: beforeunload for the tab itself, a capture-phase click listener
 * for <Link>, a sentinel history entry for the Back button, and the returned
 * navigate() for router.push() calls made by this page.
 *
 * Confirmation is asynchronous: a modal cannot block the event loop the way
 * window.confirm did, so every intercepted navigation is cancelled outright and
 * replayed by confirmNavigation() once the user agrees.
 */
export function useNavigationGuard({ enabled }: Options) {
    const router = useRouter();
    const [pending, setPending] = useState<PendingNavigation | null>(null);
    const enabledRef = useRef(enabled);
    /** Set by the Back guard so confirmNavigation can replay the pop. */
    const releaseBackRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    // Tab close, reload, and navigation to another origin. This one stays with
    // the browser's own dialog — a page cannot render UI over an unload.
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

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            setPending({ type: "push", href: url.pathname + url.search + url.hash });
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

            // The pop already happened, so put the page back before asking.
            pushSentinel();
            setPending({ type: "back" });
        };

        window.addEventListener("popstate", handlePopState);

        releaseBackRef.current = () => {
            released = true;
            window.removeEventListener("popstate", handlePopState);
            // The sentinel and the guarded entry both sit above where Back was
            // headed, so skip past the pair in one go.
            history.go(-2);
        };

        return () => {
            window.removeEventListener("popstate", handlePopState);
            releaseBackRef.current = null;
            // Drop the sentinel when the guard turns off while the page is still open.
            if (!released && history.state?.[SENTINEL]) history.back();
        };
    }, [enabled]);

    /** router.push() that asks first. */
    const navigate = useCallback((href: string) => {
        if (!enabledRef.current) {
            router.push(href);
            return;
        }

        setPending({ type: "push", href });
    }, [router]);

    /** Leave the page, replaying whichever navigation was intercepted. */
    const confirmNavigation = useCallback(() => {
        if (!pending) return;

        setPending(null);

        if (pending.type === "back") releaseBackRef.current?.();
        else router.push(pending.href);
    }, [pending, router]);

    /** Stay on the page. Back has already been undone by the sentinel. */
    const cancelNavigation = useCallback(() => setPending(null), []);

    // Derived rather than cleared in an effect, so a guard that switches off
    // mid-flight (a save completing, say) takes its modal down with it.
    return { navigate, isBlocked: enabled && pending !== null, confirmNavigation, cancelNavigation };
}
