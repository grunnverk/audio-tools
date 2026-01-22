/**
 * Types for audio recording
 */

export interface AudioDevice {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface RecordingOptions {
  /** Audio device to use (optional, uses default if not specified) */
  device?: AudioDevice | string;

  /** Maximum recording duration in seconds (optional) */
  duration?: number;

  /** Output file path (optional, generates temp file if not specified) */
  outputPath?: string;

  /** Countdown delay before recording starts (optional, default: 3) */
  countdownDelay?: number;

  /** Sample rate in Hz (optional, default: 44100) */
  sampleRate?: number;

  /** Audio format (optional, default: 'wav') */
  format?: 'wav' | 'mp3' | 'flac';
}

export interface RecordingResult {
  /** Path to recorded audio file */
  filePath: string;

  /** Recording duration in seconds */
  duration: number;

  /** File size in bytes */
  fileSize: number;
}

// Logger interface is now exported from @grunnverk/shared
// Import it from there: import type { Logger } from '@grunnverk/shared';

