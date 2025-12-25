/**
 * @eldrforge/audio-tools
 * Audio recording tools for voice-driven development workflows
 */

// Types
export * from './types';

// Logger
export { setLogger, getLogger } from './logger';

// Countdown
export { countdown } from './countdown';

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
} from './recording';

// Transcription
export { transcribeAudio } from './transcription';

