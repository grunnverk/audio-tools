/**
 * Audio recording functionality
 */

import { processAudio } from '@theunwalked/unplayable';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getLogger } from './logger';
import type { RecordingOptions, RecordingResult } from './types';

/**
 * Record audio using @theunwalked/unplayable
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
 * Archive audio file to specified directory
 */
export async function archiveAudio(
    audioPath: string,
    archiveDir: string,
    filename?: string
): Promise<string> {
    const logger = getLogger();

    try {
        // Ensure archive directory exists
        await fs.mkdir(archiveDir, { recursive: true });

        // Determine archive filename
        const basename = filename || `audio-${Date.now()}.wav`;
        const archivePath = join(archiveDir, basename);

        // Copy file to archive
        await fs.copyFile(audioPath, archivePath);

        logger.info(`Audio archived to: ${archivePath}`);
        return archivePath;
    } catch (error) {
        logger.error('Failed to archive audio:', error);
        throw new Error(`Archive failed: ${error}`);
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

