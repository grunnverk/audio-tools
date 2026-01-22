/**
 * Audio Device Selection Example
 *
 * This example demonstrates how to list and select
 * audio input devices for recording
 */

/* eslint-disable no-console */

import {
    listAudioDevices,
    getDefaultDevice,
    selectDeviceInteractive,
    recordAudio,
    setLogger
} from '@grunnverk/audio-tools';
import { createLogger, format, transports } from 'winston';

// Configure logging
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.simple()
    ),
    transports: [new transports.Console()]
});
setLogger(logger);

async function main() {
    console.log('🎤 Audio Device Selection Demo');
    console.log('===============================\n');

    try {
    // Method 1: List available devices
        console.log('Method 1: Listing available devices...');
        const devices = await listAudioDevices();

        if (devices.length === 0) {
            console.log('⚠️  Direct device listing not fully implemented');
            console.log('    Use interactive selection instead (Method 2)\n');
        } else {
            console.log(`Found ${devices.length} device(s):\n`);
            devices.forEach((device, index) => {
                const defaultMarker = device.isDefault ? ' (default)' : '';
                console.log(`  ${index + 1}. ${device.name}${defaultMarker}`);
                console.log(`     ID: ${device.id}`);
            });
            console.log();
        }

        // Method 2: Interactive device selection
        console.log('Method 2: Interactive device selection...');
        console.log('This will show a menu to select your audio device:\n');

        const selectedDevice = await selectDeviceInteractive();
        console.log(`✅ Selected device: ${selectedDevice}\n`);

        // Method 3: Use default device
        console.log('Method 3: Using default device...');
        const defaultDevice = await getDefaultDevice();

        if (defaultDevice) {
            console.log(`✅ Default device: ${defaultDevice.name}\n`);
        } else {
            console.log('⚠️  No default device found\n');
        }

        // Record with selected device
        console.log('Would you like to test record with the selected device?');
        console.log('Press ENTER to start a 10-second test recording...\n');

        // Wait for user input
        await waitForEnter();

        console.log('Recording 10 seconds...\n');
        const result = await recordAudio({
            duration: 10,
            countdownDelay: 3,
        });

        console.log('\n✅ Test recording complete!');
        console.log(`📁 File: ${result.filePath}`);
        console.log(`⏱️  Duration: ${result.duration.toFixed(2)} seconds`);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

function waitForEnter(): Promise<void> {
    return new Promise((resolve) => {
        process.stdin.once('data', () => {
            resolve();
        });
    });
}

main();

