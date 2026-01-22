/**
 * Audio transcription utilities
 * Wraps @grunnverk/ai-service for convenience
 */

import { transcribeAudio as aiTranscribe } from '@grunnverk/ai-service';
import { getLogger } from '@grunnverk/shared';

/**
 * Transcribe audio file using AI service
 * This is a convenience wrapper around @grunnverk/ai-service
 */
export async function transcribeAudio(audioPath: string): Promise<string> {
    const logger = getLogger();

    try {
        logger.info('Transcribing audio...');
        const result = await aiTranscribe(audioPath);
        const transcript = result.text;
        logger.info('Transcription complete');
        return transcript;
    } catch (error) {
        logger.error('Transcription failed:', error);
        throw new Error(`Transcription failed: ${error}`);
    }
}

