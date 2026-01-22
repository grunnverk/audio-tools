/**
 * Basic Audio Recording Example
 *
 * This example demonstrates the simplest way to record audio
 * using @grunnverk/audio-tools
 */

/* eslint-disable no-console */

import { recordAudio, setLogger } from '@grunnverk/audio-tools';
import { createLogger, format, transports } from 'winston';

// Optional: Configure logging
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
    console.log('Starting basic audio recording...');
    console.log('Press ENTER to stop recording\n');

    try {
    // Record audio with default settings
        const result = await recordAudio({
            duration: 60, // Maximum 60 seconds
            countdownDelay: 3, // 3-second countdown before recording starts
        });

        console.log('\n✅ Recording complete!');
        console.log(`📁 File: ${result.filePath}`);
        console.log(`⏱️  Duration: ${result.duration.toFixed(2)} seconds`);
        console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error('❌ Recording failed:', error);
        process.exit(1);
    }
}

main();

