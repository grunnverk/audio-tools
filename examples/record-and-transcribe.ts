/**
 * Record and Transcribe Example
 *
 * This example shows how to record audio and immediately
 * transcribe it using OpenAI's Whisper API
 */

/* eslint-disable no-console */

import {
    recordAudio,
    transcribeAudio,
    archiveAudio,
    deleteAudio,
    setLogger
} from '@grunnverk/audio-tools';
import { createLogger, format, transports } from 'winston';
import { config } from 'dotenv';

// Load environment variables (for OPENAI_API_KEY)
config();

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
    console.log('🎙️  Record and Transcribe Audio');
    console.log('================================\n');

    let audioPath: string | null = null;

    try {
    // Step 1: Record audio
        console.log('Step 1: Recording audio...');
        console.log('Press ENTER to stop recording\n');

        const recording = await recordAudio({
            duration: 120, // Max 2 minutes
            countdownDelay: 3,
        });

        audioPath = recording.filePath;
        console.log(`✅ Recorded ${recording.duration.toFixed(2)}s of audio\n`);

        // Step 2: Transcribe
        console.log('Step 2: Transcribing audio...');
        const transcript = await transcribeAudio(audioPath);

        console.log('\n✅ Transcription complete!\n');
        console.log('━'.repeat(60));
        console.log(transcript);
        console.log('━'.repeat(60));
        console.log();

        // Step 3: Archive (save both audio and transcript with timestamps)
        console.log('Step 3: Archiving files...');
        const archive = await archiveAudio(
            audioPath,
            transcript,
            'output/audio-archive'
        );

        console.log(`✅ Audio archived to: ${archive.audioPath}`);
        console.log(`✅ Transcript saved to: ${archive.transcriptPath}\n`);

        // Step 4: Clean up temporary audio file
        await deleteAudio(audioPath);
        console.log('✅ Temporary audio file cleaned up');

    } catch (error) {
        console.error('\n❌ Error:', error);

        // Clean up on error
        if (audioPath) {
            try {
                await deleteAudio(audioPath);
            } catch {
                // Ignore cleanup errors
            }
        }

        process.exit(1);
    }
}

// Check for API key
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.error('Please set your OpenAI API key to use transcription');
    process.exit(1);
}

main();

