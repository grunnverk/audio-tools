import { describe, it, expect, vi } from 'vitest';
import { transcribeAudio } from '../src/transcription';

// Mock @grunnverk/ai-service
vi.mock('@grunnverk/ai-service', () => {
    return {
        transcribeAudio: vi.fn().mockResolvedValue({ text: 'Mock transcription text' }),
    };
});

describe('Transcription', () => {
    describe('transcribeAudio', () => {
        it('transcribes audio file', async () => {
            const transcript = await transcribeAudio('/path/to/audio.wav');

            expect(transcript).toBe('Mock transcription text');
        });

        it('throws error on transcription failure', async () => {
            const { transcribeAudio: aiTranscribe } = await import('@grunnverk/ai-service');
            vi.mocked(aiTranscribe).mockRejectedValueOnce(new Error('API error'));

            await expect(transcribeAudio('/path/to/audio.wav')).rejects.toThrow('Transcription failed');
        });
    });
});

