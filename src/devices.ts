/**
 * Audio device detection and selection
 */

import { selectAndConfigureAudioDevice } from '@theunwalked/unplayable';
import { homedir } from 'os';
import { join } from 'path';
import { getLogger } from './logger';
import type { AudioDevice } from './types';

/**
 * List all available audio input devices
 * Note: This is a placeholder - @theunwalked/unplayable doesn't provide a direct API for this
 * In practice, you would use selectAndConfigureAudioDevice for device selection
 */
export async function listAudioDevices(): Promise<AudioDevice[]> {
    const logger = getLogger();
    
    // This would require extending @theunwalked/unplayable or using a different library
    logger.warn('listAudioDevices is not fully implemented - use selectDeviceInteractive instead');
    return [];
}

/**
 * Get the default audio input device
 */
export async function getDefaultDevice(): Promise<AudioDevice | null> {
    const devices = await listAudioDevices();
    return devices.find((d) => d.isDefault) || devices[0] || null;
}

/**
 * Find device by ID or name
 */
export async function findDevice(idOrName: string): Promise<AudioDevice | null> {
    const devices = await listAudioDevices();

    return (
        devices.find((d) => d.id === idOrName) ||
        devices.find((d) => d.name === idOrName) ||
        null
    );
}

/**
 * Interactive device selection using @theunwalked/unplayable
 * This function uses the built-in interactive device selector
 */
export async function selectDeviceInteractive(): Promise<string> {
    const logger = getLogger();

    try {
        const preferencesDir = join(homedir(), '.unplayable');
        const result = await selectAndConfigureAudioDevice(preferencesDir, logger, false);
        return result;
    } catch (error) {
        logger.error('Device selection failed:', error);
        throw new Error(`Device selection failed: ${error}`);
    }
}

