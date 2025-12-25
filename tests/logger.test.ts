import { describe, it, expect, beforeEach } from 'vitest';
import { getLogger, setLogger } from '../src/logger';
import type { Logger } from '../src/types';

describe('Logger', () => {
    beforeEach(() => {
        // Reset logger to default
        setLogger(undefined as any);
    });

    it('returns console fallback by default', () => {
        const logger = getLogger();
        expect(logger).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.error).toBeDefined();
    });

    it('uses custom logger when set', () => {
        const messages: string[] = [];
        const customLogger: Logger = {
            error: (msg) => messages.push(`ERROR: ${msg}`),
            warn: (msg) => messages.push(`WARN: ${msg}`),
            info: (msg) => messages.push(`INFO: ${msg}`),
            debug: (msg) => messages.push(`DEBUG: ${msg}`),
        };

        setLogger(customLogger);
        const logger = getLogger();

        logger.info('test message');
        expect(messages).toContain('INFO: test message');
    });
});

