/**
 * Custom Output Path Example
 *
 * This example shows how to specify custom paths
 * for recorded audio files
 */

/* eslint-disable no-console */

import { recordAudio, setLogger } from '@grunnverk/audio-tools';
import { createLogger, format, transports } from 'winston';
import { mkdir } from 'fs/promises';
import { join } from 'path';

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
    console.log('📁 Custom Output Path Example');
    console.log('=============================\n');

    // Create output directory
    const outputDir = join(process.cwd(), 'my-recordings');
    await mkdir(outputDir, { recursive: true });

    try {
    // Generate custom filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputPath = join(outputDir, `recording-${timestamp}.wav`);

        console.log(`Recording to: ${outputPath}`);
        console.log('Press ENTER to stop recording\n');

        // Record with custom output path
        const result = await recordAudio({
            outputPath,
            duration: 60,
            countdownDelay: 3,
        });

        console.log('\n✅ Recording saved!');
        console.log(`📁 Location: ${result.filePath}`);
        console.log(`⏱️  Duration: ${result.duration.toFixed(2)} seconds`);
        console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

main();

