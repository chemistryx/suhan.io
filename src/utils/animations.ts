const DEFAULT_STAGGER_STEP = 0.1;
const MAX_STAGGER_DELAY = 0.4;

/**
 * Stagger delay for a list item's entrance animation, capped so the delay never
 * grows with the list. Without a ceiling a long list leaves its tail invisible
 * for seconds after paint — at 0.1s a step, the 50th item waits five.
 */
export function toStaggerDelay(index: number, step: number = DEFAULT_STAGGER_STEP) {
    return `${Math.min((index + 1) * step, MAX_STAGGER_DELAY)}s`;
}
