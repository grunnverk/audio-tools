/**
 * Audio recording functionality
 */

import { processAudio } from '@utilarium/unplayable';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getLogger } from '@grunnverk/shared';
import type { RecordingOptions, RecordingResult } from './types';

/**
 * Record audio using @utilarium/unplayable
 */
export async function recordAudio(
    options: RecordingOptions = {}
): Promise<RecordingResult> {
    const logger = getLogger();

    const {
        duration,
        outputPath,
    } = options;

    const startTime = Date.now();

    try {
        logger.info('Starting audio recording...');
        logger.info('Press ENTER to stop recording');

        const audioResult = await processAudio({
            file: undefined,
            maxRecordingTime: duration,
            outputDirectory: outputPath ? outputPath.substring(0, outputPath.lastIndexOf('/')) : 'output',
            debug: false
        });

        if (audioResult.cancelled) {
            throw new Error('Recording cancelled by user');
        }

        const endTime = Date.now();
        const actualDuration = (endTime - startTime) / 1000;

        // Get file stats
        const filePath = audioResult.audioFilePath || join('output', `recording-${Date.now()}.wav`);
        const stats = await fs.stat(filePath);

        logger.info(`Recording complete: ${filePath}`);
        logger.info(`Duration: ${actualDuration.toFixed(2)} seconds`);
        logger.info(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

        return {
            filePath,
            duration: actualDuration,
            fileSize: stats.size,
        };
    } catch (error) {
        logger.error('Recording failed:', error);
        throw new Error(`Recording failed: ${error}`);
    }
}

/**
 * Get timestamped filename for archiving
 */
function getTimestampedFilename(baseName: string, extension: string = '.json'): string {
    const now = new Date();

    // Format as YYMMdd-HHmm (e.g., 250701-1030)
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const hh = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');

    const timestamp = `${yy}${mm}${dd}-${hh}${min}`;

    return `${timestamp}-${baseName}${extension}`;
}

/**
 * Get timestamped filename for archived audio
 */
export function getTimestampedArchivedAudioFilename(originalExtension: string = '.wav'): string {
    return getTimestampedFilename('review-audio', originalExtension);
}

/**
 * Get timestamped filename for archived transcript
 */
export function getTimestampedArchivedTranscriptFilename(): string {
    return getTimestampedFilename('review-transcript', '.md');
}

/**
 * Archive audio file with transcription to specified directory
 * This saves BOTH the audio file AND transcription text together
 * @param originalAudioPath Path to the original audio file
 * @param transcriptionText The transcribed text content
 * @param outputDirectory Directory to save archived files (default: 'output')
 * @returns Paths to both archived audio and transcript files
 */
export async function archiveAudio(
    originalAudioPath: string,
    transcriptionText: string,
    outputDirectory: string = 'output'
): Promise<{ audioPath: string; transcriptPath: string }> {
    const logger = getLogger();
    const path = await import('path');

    try {
        // Ensure the output directory exists
        await fs.mkdir(outputDirectory, { recursive: true });

        // Get file extension from original audio file
        const originalExtension = path.extname(originalAudioPath);

        // Generate timestamped filenames
        const archivedAudioFilename = getTimestampedArchivedAudioFilename(originalExtension);
        const archivedTranscriptFilename = getTimestampedArchivedTranscriptFilename();

        // Full paths for archived files
        const archivedAudioPath = path.join(outputDirectory, archivedAudioFilename);
        const archivedTranscriptPath = path.join(outputDirectory, archivedTranscriptFilename);

        // Copy audio file if it exists
        try {
            await fs.access(originalAudioPath);
            const audioBuffer = await fs.readFile(originalAudioPath);
            await fs.writeFile(archivedAudioPath, audioBuffer);
            logger.debug('Archived audio file to: %s', archivedAudioPath);
        } catch {
            logger.warn('AUDIO_FILE_NOT_FOUND: Original audio file not accessible | Path: %s | Impact: Cannot archive original', originalAudioPath);
        }

        // Save transcription text
        const transcriptContent = `# Audio Transcription Archive\n\n**Original Audio File:** ${originalAudioPath}\n**Archived:** ${new Date().toISOString()}\n\n## Transcription\n\n${transcriptionText}`;
        await fs.writeFile(archivedTranscriptPath, transcriptContent, 'utf8');
        logger.debug('Archived transcription to: %s', archivedTranscriptPath);

        logger.info('AUDIO_ARCHIVED: Audio and transcript archived successfully | Audio: %s | Transcript: %s | Status: archived', archivedAudioFilename, archivedTranscriptFilename);

        return {
            audioPath: archivedAudioPath,
            transcriptPath: archivedTranscriptPath
        };

    } catch (error: any) {
        logger.error('AUDIO_ARCHIVE_FAILED: Failed to archive audio files | Error: %s | Impact: Audio not preserved', error.message);
        throw new Error(`Audio archiving failed: ${error.message}`);
    }
}

/**
 * Delete audio file
 */
export async function deleteAudio(audioPath: string): Promise<void> {
    const logger = getLogger();

    try {
        await fs.unlink(audioPath);
        logger.debug(`Deleted audio file: ${audioPath}`);
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            logger.warn(`Failed to delete audio file: ${error}`);
        }
    }
}

/**
 * Get audio file duration (requires external library or audio analysis)
 * For now, returns null - can be enhanced later
 */
export async function getAudioDuration(_audioPath: string): Promise<number | null> {
    // TODO: Implement audio duration detection
    // May require additional library like 'music-metadata'
    return null;
}

