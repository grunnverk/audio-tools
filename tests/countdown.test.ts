import { describe, it, expect } from 'vitest';
import { countdown } from '../src/countdown';

describe('Countdown', () => {
    it('counts down from specified seconds', async () => {
        const ticks: number[] = [];
        const onTick = (n: number) => ticks.push(n);

        await countdown(3, onTick);

        expect(ticks).toEqual([3, 2, 1]);
    });

    it('completes countdown without callback', async () => {
        await expect(countdown(2)).resolves.not.toThrow();
    });

    it('handles zero seconds', async () => {
        const ticks: number[] = [];
        await countdown(0, (n) => ticks.push(n));
        expect(ticks).toEqual([]);
    });

    it('takes appropriate time', async () => {
        const start = Date.now();
        await countdown(2);
        const elapsed = Date.now() - start;

        // Should take at least 2 seconds (with some tolerance)
        expect(elapsed).toBeGreaterThanOrEqual(1900);
        expect(elapsed).toBeLessThan(2500);
    });
});

