/**
 * @grunnverk/audio-tools
 * Audio recording tools for voice-driven development workflows
 */

// Types
export * from './types';

// Logger - re-export from shared
export { setLogger, getLogger, type Logger } from '@grunnverk/shared';

// Countdown
export {
    countdown,
    CountdownTimer,
    startCountdown,
    createAudioRecordingCountdown
} from './countdown';
export type { CountdownOptions } from './countdown';

// Device detection and selection
export {
    listAudioDevices,
    getDefaultDevice,
    findDevice,
    selectDeviceInteractive,
} from './devices';

// Recording
export {
    recordAudio,
    archiveAudio,
    deleteAudio,
    getAudioDuration,
    getTimestampedArchivedAudioFilename,
    getTimestampedArchivedTranscriptFilename,
} from './recording';

// Transcription
export { transcribeAudio } from './transcription';

