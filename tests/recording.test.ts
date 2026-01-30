import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { recordAudio, archiveAudio, deleteAudio } from '../src/recording';

// Mock @utilarium/unplayable
vi.mock('@utilarium/unplayable', () => {
    return {
        processAudio: vi.fn().mockImplementation(async () => {
            const audioPath = '/tmp/test-recording.wav';
            // Create mock audio file
            await fs.writeFile(audioPath, 'mock audio data');
            return {
                cancelled: false,
                audioFilePath: audioPath,
            };
        }),
    };
});

describe('Recording', () => {
    const testAudioPath = '/tmp/test-recording.wav';
    const archiveDir = '/tmp/audio-archive';

    afterEach(async () => {
        // Clean up test files
        try {
            await fs.unlink(testAudioPath);
        } catch {
            // Ignore if file doesn't exist
        }
        try {
            await fs.rm(archiveDir, { recursive: true, force: true });
        } catch {
            // Ignore if directory doesn't exist
        }
    });

    describe('recordAudio', () => {
        it('records audio with default options', async () => {
            const result = await recordAudio();

            expect(result).toBeDefined();
            expect(result.filePath).toBeDefined();
            expect(result.duration).toBeGreaterThan(0);
            expect(result.fileSize).toBeGreaterThan(0);
        });

        it('throws error when recording is cancelled', async () => {
            const { processAudio } = await import('@utilarium/unplayable');
            vi.mocked(processAudio).mockResolvedValueOnce({
                cancelled: true,
                audioFilePath: '',
            });

            await expect(recordAudio()).rejects.toThrow('Recording cancelled by user');
        });

        it('throws error on recording failure', async () => {
            const { processAudio } = await import('@utilarium/unplayable');
            vi.mocked(processAudio).mockRejectedValueOnce(new Error('Hardware error'));

            await expect(recordAudio()).rejects.toThrow('Recording failed');
        });
    });

    describe('archiveAudio', () => {
        beforeEach(async () => {
            // Create test audio file
            await fs.writeFile(testAudioPath, 'test audio data');
        });

        it('archives audio and transcription to specified directory', async () => {
            const result = await archiveAudio(testAudioPath, 'Test transcription', archiveDir);

            expect(result.audioPath).toContain(archiveDir);
            expect(result.transcriptPath).toContain(archiveDir);
            expect(await fs.access(result.audioPath).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(result.transcriptPath).then(() => true).catch(() => false)).toBe(true);
        });

        it('creates archive directory if needed', async () => {
            const result = await archiveAudio(testAudioPath, 'Test transcription', archiveDir);

            expect(await fs.access(archiveDir).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(result.audioPath).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(result.transcriptPath).then(() => true).catch(() => false)).toBe(true);
        });
    });

    describe('deleteAudio', () => {
        it('deletes audio file', async () => {
            await fs.writeFile(testAudioPath, 'test');
            await deleteAudio(testAudioPath);

            expect(await fs.access(testAudioPath).then(() => true).catch(() => false)).toBe(false);
        });

        it('does not throw when file does not exist', async () => {
            await expect(deleteAudio('/nonexistent/file.wav')).resolves.not.toThrow();
        });
    });
});

