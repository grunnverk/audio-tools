/**
 * Countdown timer for audio recording
 */

import { getLogger } from './logger';

/**
 * Display countdown before recording
 * @param seconds Number of seconds to count down
 * @param onTick Optional callback called on each tick
 */
export async function countdown(
    seconds: number,
    onTick?: (remaining: number) => void
): Promise<void> {
    const logger = getLogger();

    for (let i = seconds; i > 0; i--) {
        logger.info(`Recording in ${i}...`);

        if (onTick) {
            onTick(i);
        }

        await sleep(1000);
    }

    logger.info('Recording!');
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

