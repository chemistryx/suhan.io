type EventData = Record<string, string | number | boolean>;

declare global {
    interface Window { umami?: { track: (event: string, data?: EventData) => void } }
}

// No-op until the Umami script has loaded, or when it is not configured.
export const track = (event: string, data?: EventData) => {
    try {
        window.umami?.track(event, data);
    } catch {
        // analytics must never break the page
    }
};

// Umami skips every browser with this key set; used to keep the author's own visits out.
export const setTrackingDisabled = (disabled: boolean) => {
    try {
        if (disabled) localStorage.setItem("umami.disabled", "1");
        else localStorage.removeItem("umami.disabled");
    } catch {
        // storage can be unavailable (private mode)
    }
};
