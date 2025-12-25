import { describe, it, expect, vi } from 'vitest';
import { selectDeviceInteractive } from '../src/devices';

// Mock @theunwalked/unplayable
vi.mock('@theunwalked/unplayable', () => {
    return {
        selectAndConfigureAudioDevice: vi.fn().mockResolvedValue('Device configured successfully'),
    };
});

describe('Audio Devices', () => {
    describe('selectDeviceInteractive', () => {
        it('successfully selects and configures device', async () => {
            const result = await selectDeviceInteractive();

            expect(result).toBe('Device configured successfully');
        });

        it('throws error on failure', async () => {
            const { selectAndConfigureAudioDevice } = await import('@theunwalked/unplayable');
            vi.mocked(selectAndConfigureAudioDevice).mockRejectedValueOnce(new Error('No devices found'));

            await expect(selectDeviceInteractive()).rejects.toThrow('Device selection failed');
        });
    });
});

