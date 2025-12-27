import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { countdown, CountdownTimer, createAudioRecordingCountdown } from '../src/countdown';

describe('Countdown', () => {
    describe('Simple countdown function', () => {
        it('counts down from specified seconds', async () => {
            const ticks: number[] = [];
            const onTick = (n: number) => ticks.push(n);

            await countdown(3, onTick);

            // New implementation calls onTick after decrementing
            expect(ticks).toEqual([2, 1, 0]);
        });

        it('completes countdown without callback', async () => {
            await expect(countdown(2)).resolves.not.toThrow();
        }, 10000);

        it('handles zero seconds', async () => {
            const ticks: number[] = [];
            await countdown(0, (n) => ticks.push(n));
            // With 0 seconds, countdown completes immediately with one tick at 0
            expect(ticks).toEqual([]);
        });

        it('takes appropriate time', async () => {
            const start = Date.now();
            await countdown(2);
            const elapsed = Date.now() - start;

            // Should take at least 2 seconds (with some tolerance)
            expect(elapsed).toBeGreaterThanOrEqual(1900);
            expect(elapsed).toBeLessThan(3000);
        }, 10000);
    });

    describe('CountdownTimer class', () => {
        it('creates timer with correct duration', () => {
            const timer = new CountdownTimer({ durationSeconds: 10 });
            expect(timer.getRemainingSeconds()).toBe(10);
        });

        it('calls onTick callback each second', async () => {
            const ticks: number[] = [];
            const timer = new CountdownTimer({
                durationSeconds: 3,
                onTick: (n) => ticks.push(n),
                clearOnComplete: false
            });

            await timer.start();
            expect(ticks).toEqual([2, 1, 0]);
        }, 10000);

        it('calls onComplete when finished', async () => {
            const onComplete = vi.fn();
            const timer = new CountdownTimer({
                durationSeconds: 1,
                onComplete,
                clearOnComplete: false
            });

            await timer.start();
            expect(onComplete).toHaveBeenCalledTimes(1);
        }, 5000);

        it('can be stopped early', async () => {
            const timer = new CountdownTimer({
                durationSeconds: 10,
                clearOnComplete: false
            });

            // Start but don't await
            timer.start();

            // Wait for at least one tick (1+ seconds)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stop the timer
            timer.stop();

            // Timer should have ticked down
            expect(timer.getRemainingSeconds()).toBeLessThan(10);
            expect(timer.getRemainingSeconds()).toBeGreaterThanOrEqual(0);
        }, 5000);

        it('handles destroy correctly', () => {
            const timer = new CountdownTimer({ durationSeconds: 5 });
            timer.destroy();
            expect(timer.isTimerDestroyed()).toBe(true);
        });
    });

    describe('createAudioRecordingCountdown', () => {
        it('creates timer with sensible defaults', () => {
            const timer = createAudioRecordingCountdown(60);
            expect(timer.getRemainingSeconds()).toBe(60);
            expect(timer.isTimerDestroyed()).toBe(false);
        });
    });
});
