# @eldrforge/audio-tools

<div align="center">

**Professional Audio Recording & Transcription Toolkit for Node.js**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/@eldrforge/audio-tools.svg)](https://www.npmjs.com/package/@eldrforge/audio-tools)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

*Voice-driven development workflows made simple*

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Examples](#-examples) • [API Reference](#-api-reference) • [Documentation](#-documentation)

</div>

---

## 🎯 Overview

`@eldrforge/audio-tools` is a comprehensive TypeScript library for recording, transcribing, and managing audio in Node.js applications. Built for developers who want to integrate voice-driven workflows, voice notes, audio documentation, or AI-powered transcription into their projects.

### Key Highlights

- 🎙️ **High-Quality Recording** - Capture audio from any input device with configurable settings
- 🎬 **Visual Countdown Timers** - Professional recording countdowns with ANSI colors and beeps
- 🔊 **Device Management** - List, select, and configure audio input devices
- 🤖 **AI Transcription** - Powered by OpenAI's Whisper API for accurate transcription
- 📦 **Archive Management** - Timestamped archiving of audio files and transcripts
- 🔧 **Fully Typed** - Complete TypeScript definitions for excellent IDE support
- 🪵 **Flexible Logging** - Optional Winston logger integration
- 🚀 **Zero Config** - Sensible defaults, works out of the box

## ✨ Features

### Audio Recording
- ✅ Cross-platform support (macOS, Linux, Windows)
- ✅ Device selection and configuration
- ✅ Configurable sample rates and formats (WAV, MP3, FLAC)
- ✅ Duration limits and manual stop controls
- ✅ Custom output paths
- ✅ Real-time recording status

### Visual Countdown Timers
- ✅ ANSI color-coded terminal display
- ✅ In-place updating (no screen clutter)
- ✅ Audio beeps at configurable intervals
- ✅ Warning colors when time is low
- ✅ Callback support for custom behaviors
- ✅ Graceful cleanup and process handling

### Transcription & Archiving
- ✅ OpenAI Whisper API integration
- ✅ Automatic file archiving with timestamps
- ✅ Transcript preservation in Markdown format
- ✅ Batch processing support
- ✅ Error recovery and retry logic

## 📦 Installation

```bash
npm install @eldrforge/audio-tools
```

### Peer Dependencies

The library has optional peer dependencies for enhanced functionality:

```bash
# For logging (recommended)
npm install winston

# For shared utilities (optional)
npm install @eldrforge/shared
```

### System Requirements

- **Node.js**: 18.x or later
- **Operating System**: macOS, Linux, or Windows
- **Audio Input**: Microphone or audio input device

## 🚀 Quick Start

### Basic Recording

```typescript
import { recordAudio } from '@eldrforge/audio-tools';

// Record up to 60 seconds of audio
const result = await recordAudio({
  duration: 60,
  countdownDelay: 3,
});

console.log('Audio recorded:', result.filePath);
console.log('Duration:', result.duration, 'seconds');
console.log('File size:', result.fileSize, 'bytes');
```

### Record and Transcribe

```typescript
import { recordAudio, transcribeAudio, archiveAudio } from '@eldrforge/audio-tools';

// Record audio
const recording = await recordAudio({ duration: 120 });

// Transcribe with OpenAI Whisper
const transcript = await transcribeAudio(recording.filePath);

// Archive both audio and transcript with timestamps
const archive = await archiveAudio(
  recording.filePath,
  transcript,
  'output/recordings'
);

console.log('Transcript:', transcript);
console.log('Archived to:', archive.audioPath);
```

### Interactive Device Selection

```typescript
import { selectDeviceInteractive, recordAudio } from '@eldrforge/audio-tools';

// Let user select audio device interactively
const device = await selectDeviceInteractive();

// Record with selected device
const result = await recordAudio({ duration: 60 });
```

### Countdown Timer

```typescript
import { CountdownTimer } from '@eldrforge/audio-tools';

const timer = new CountdownTimer({
  durationSeconds: 30,
  beepAt30Seconds: true,
  redAt30Seconds: true,
  onTick: (remaining) => {
    console.log(`${remaining} seconds remaining`);
  },
  onComplete: () => {
    console.log('Time\'s up!');
  }
});

await timer.start();
```

## 📖 Documentation

Comprehensive documentation is available:

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Step-by-step tutorial for beginners
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - One-page cheat sheet
- **[CLI Examples](docs/CLI_EXAMPLES.md)** - Build command-line tools
- **[FAQ](docs/FAQ.md)** - Frequently asked questions
- **[Architecture](docs/ARCHITECTURE.md)** - Design and internals
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Documentation Index](docs/INDEX.md)** - Complete documentation map

## 📚 Examples

The `examples/` directory contains comprehensive, runnable examples:

| Example | Description | File |
|---------|-------------|------|
| **Basic Recording** | Simple audio recording with default settings | `basic-recording.ts` |
| **Record & Transcribe** | Complete workflow with transcription and archiving | `record-and-transcribe.ts` |
| **Countdown Demo** | Visual countdown timer demonstrations | `countdown-demo.ts` |
| **Device Selection** | List and select audio input devices | `device-selection.ts` |
| **Custom Output** | Specify custom paths and filenames | `custom-output-path.ts` |

### Running Examples

```bash
cd examples
npm install
npm run basic          # Basic recording
npm run transcribe     # Record and transcribe (requires OPENAI_API_KEY)
npm run countdown      # Countdown timer demos
npm run devices        # Device selection
npm run custom-path    # Custom output paths
```

## 📖 API Reference

### Recording Functions

#### `recordAudio(options?: RecordingOptions): Promise<RecordingResult>`

Record audio from an input device.

**Options:**
```typescript
interface RecordingOptions {
  device?: AudioDevice | string;     // Audio device (optional, uses default)
  duration?: number;                 // Max duration in seconds (optional)
  outputPath?: string;               // Output file path (optional, generates temp)
  countdownDelay?: number;          // Countdown delay (default: 3)
  sampleRate?: number;              // Sample rate in Hz (default: 44100)
  format?: 'wav' | 'mp3' | 'flac';  // Audio format (default: 'wav')
}
```

**Returns:**
```typescript
interface RecordingResult {
  filePath: string;   // Path to recorded file
  duration: number;   // Recording duration in seconds
  fileSize: number;   // File size in bytes
}
```

**Example:**
```typescript
const result = await recordAudio({
  duration: 60,
  sampleRate: 48000,
  format: 'wav',
  countdownDelay: 3
});
```

---

#### `archiveAudio(audioPath: string, transcript: string, outputDir?: string)`

Archive audio file with its transcription.

**Parameters:**
- `audioPath`: Path to the original audio file
- `transcript`: Transcribed text content
- `outputDir`: Directory to save archived files (default: 'output')

**Returns:**
```typescript
{
  audioPath: string;      // Path to archived audio file
  transcriptPath: string; // Path to archived transcript
}
```

**Example:**
```typescript
const archive = await archiveAudio(
  'recording.wav',
  'This is the transcribed text...',
  'output/archives'
);

// Creates files like:
// - output/archives/250701-1430-review-audio.wav
// - output/archives/250701-1430-review-transcript.md
```

---

#### `deleteAudio(audioPath: string): Promise<void>`

Delete an audio file safely.

**Example:**
```typescript
await deleteAudio('temp-recording.wav');
```

---

#### `getAudioDuration(audioPath: string): Promise<number | null>`

Get the duration of an audio file (currently returns null, planned feature).

---

### Device Functions

#### `listAudioDevices(): Promise<AudioDevice[]>`

List all available audio input devices.

**Returns:**
```typescript
interface AudioDevice {
  id: string;
  name: string;
  isDefault: boolean;
}
```

**Example:**
```typescript
const devices = await listAudioDevices();
devices.forEach(device => {
  console.log(`${device.name} (${device.id})`);
  if (device.isDefault) {
    console.log('  ✓ Default device');
  }
});
```

---

#### `getDefaultDevice(): Promise<AudioDevice | null>`

Get the system's default audio input device.

**Example:**
```typescript
const device = await getDefaultDevice();
if (device) {
  console.log('Default device:', device.name);
}
```

---

#### `findDevice(idOrName: string): Promise<AudioDevice | null>`

Find a device by its ID or name.

**Example:**
```typescript
const device = await findDevice('MacBook Pro Microphone');
if (device) {
  console.log('Found device:', device.id);
}
```

---

#### `selectDeviceInteractive(): Promise<string>`

Present an interactive menu to select an audio device.

**Example:**
```typescript
const deviceId = await selectDeviceInteractive();
console.log('Selected device:', deviceId);
```

---

### Transcription Functions

#### `transcribeAudio(audioPath: string): Promise<string>`

Transcribe an audio file using OpenAI's Whisper API.

**Requirements:**
- `OPENAI_API_KEY` environment variable must be set
- Audio file must be in a supported format (WAV, MP3, FLAC, etc.)

**Example:**
```typescript
const transcript = await transcribeAudio('recording.wav');
console.log('Transcription:', transcript);
```

---

### Countdown Timer Classes

#### `CountdownTimer`

A visual countdown timer with customizable behavior.

**Constructor Options:**
```typescript
interface CountdownOptions {
  durationSeconds: number;          // Duration in seconds
  beepAt30Seconds?: boolean;        // Beep at 30s (default: true)
  redAt30Seconds?: boolean;         // Red color at 30s (default: true)
  onTick?: (remaining: number) => void;   // Called every second
  onComplete?: () => void;          // Called when complete
  clearOnComplete?: boolean;        // Clear display when done (default: false)
}
```

**Methods:**
- `start(): Promise<void>` - Start the countdown
- `stop(): void` - Stop the countdown
- `getRemainingSeconds(): number` - Get remaining time
- `destroy(): void` - Clean up resources
- `isTimerDestroyed(): boolean` - Check if destroyed

**Example:**
```typescript
const timer = new CountdownTimer({
  durationSeconds: 60,
  beepAt30Seconds: true,
  redAt30Seconds: true,
  onTick: (remaining) => {
    if (remaining % 10 === 0) {
      console.log(`${remaining} seconds left`);
    }
  },
  onComplete: () => {
    console.log('Recording complete!');
  }
});

await timer.start();
```

---

#### `startCountdown(options: CountdownOptions): Promise<void>`

Convenience function to create and start a countdown timer.

**Example:**
```typescript
await startCountdown({
  durationSeconds: 30,
  onComplete: () => console.log('Done!')
});
```

---

#### `createAudioRecordingCountdown(seconds: number): CountdownTimer`

Create a countdown timer with sensible defaults for audio recording.

**Example:**
```typescript
const timer = createAudioRecordingCountdown(120);
await timer.start();
```

---

### Utility Functions

#### `getTimestampedArchivedAudioFilename(extension?: string): string`

Generate a timestamped filename for archived audio.

**Example:**
```typescript
const filename = getTimestampedArchivedAudioFilename('.mp3');
// Returns: "250701-1430-review-audio.mp3"
```

---

#### `getTimestampedArchivedTranscriptFilename(): string`

Generate a timestamped filename for archived transcripts.

**Example:**
```typescript
const filename = getTimestampedArchivedTranscriptFilename();
// Returns: "250701-1430-review-transcript.md"
```

---

### Logging

#### `setLogger(logger: Logger): void`

Set a custom Winston logger instance.

**Example:**
```typescript
import { setLogger } from '@eldrforge/audio-tools';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'audio-tools.log' })
  ]
});

setLogger(logger);
```

---

#### `getLogger(): Logger`

Get the current logger instance.

**Example:**
```typescript
import { getLogger } from '@eldrforge/audio-tools';

const logger = getLogger();
logger.info('Starting recording...');
```

---

## 🎬 Complete Usage Example

Here's a complete example showing a typical workflow:

```typescript
import {
  recordAudio,
  transcribeAudio,
  archiveAudio,
  deleteAudio,
  CountdownTimer,
  setLogger
} from '@eldrforge/audio-tools';
import { createLogger, format, transports } from 'winston';
import { config } from 'dotenv';

// Load environment variables
config();

// Configure logging
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'audio-tools.log' })
  ]
});

setLogger(logger);

async function recordAndTranscribeVoiceNote() {
  let audioPath: string | null = null;

  try {
    console.log('🎙️  Voice Note Recorder');
    console.log('======================\n');

    // Step 1: Countdown
    console.log('Get ready to speak...\n');
    const countdown = new CountdownTimer({
      durationSeconds: 3,
      beepAt30Seconds: false,
      clearOnComplete: true
    });
    await countdown.start();

    // Step 2: Record
    console.log('🔴 Recording... (Press ENTER to stop)\n');
    const recording = await recordAudio({
      duration: 300, // 5 minutes max
      sampleRate: 48000,
      format: 'wav'
    });

    audioPath = recording.filePath;
    logger.info(`Recorded ${recording.duration.toFixed(2)}s of audio`);

    // Step 3: Transcribe
    console.log('\n📝 Transcribing...');
    const transcript = await transcribeAudio(audioPath);

    console.log('\n✅ Transcript:\n');
    console.log('─'.repeat(60));
    console.log(transcript);
    console.log('─'.repeat(60));

    // Step 4: Archive
    console.log('\n💾 Archiving...');
    const archive = await archiveAudio(
      audioPath,
      transcript,
      'output/voice-notes'
    );

    logger.info(`Archived to: ${archive.audioPath}`);
    logger.info(`Transcript saved: ${archive.transcriptPath}`);

    // Step 5: Cleanup
    await deleteAudio(audioPath);
    logger.info('Temporary file deleted');

    console.log('\n✅ Voice note saved successfully!');

  } catch (error) {
    logger.error('Failed to process voice note:', error);

    // Cleanup on error
    if (audioPath) {
      try {
        await deleteAudio(audioPath);
      } catch {
        // Ignore cleanup errors
      }
    }

    throw error;
  }
}

// Run the example
recordAndTranscribeVoiceNote().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - Required for transcription functionality
- `NO_COLOR` - Disable ANSI colors in terminal output
- `TERM` - Terminal type detection for ANSI support

### Audio Preferences

The library uses `@theunwalked/unplayable` which stores audio device preferences in:
```
~/.unplayable/audio-preferences.json
```

You can manually edit this file to set default devices.

## 🏗️ Architecture

### Dependencies

- **[@theunwalked/unplayable](https://github.com/theunwalked/unplayable)** - Cross-platform audio recording
- **[@eldrforge/ai-service](https://github.com/grunnverk/ai-service)** - OpenAI Whisper integration
- **[@eldrforge/shared](https://github.com/grunnverk/shared)** - Optional shared utilities
- **winston** - Optional structured logging

### Platform Support

| Platform | Status | Backend |
|----------|--------|---------|
| macOS | ✅ Supported | CoreAudio |
| Linux | ✅ Supported | ALSA/PulseAudio |
| Windows | ✅ Supported | WASAPI |

## 🧪 Testing

The library includes comprehensive test coverage:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test

# Watch mode
npm run test -- --watch
```

## 🛠️ Development

### Build from Source

```bash
# Clone the repository
git clone https://github.com/grunnverk/audio-tools.git
cd audio-tools

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

### Project Structure

```
audio-tools/
├── src/
│   ├── countdown.ts      # Countdown timer utilities
│   ├── devices.ts        # Audio device management
│   ├── recording.ts      # Recording and archiving
│   ├── transcription.ts  # Transcription wrapper
│   ├── types.ts          # TypeScript definitions
│   └── index.ts          # Main exports
├── tests/                # Test files
├── examples/             # Usage examples
├── dist/                 # Compiled output
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Run tests: `npm test`
5. Commit with clear messages
6. Push and open a Pull Request

## 📝 License

Apache-2.0 License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **[@eldrforge/ai-service](https://github.com/grunnverk/ai-service)** - AI services including transcription
- **[@eldrforge/shared](https://github.com/grunnverk/shared)** - Shared utilities
- **[@theunwalked/unplayable](https://github.com/theunwalked/unplayable)** - Cross-platform audio library

## 💬 Support

- 🚀 **Getting Started**: [Tutorial Guide](docs/GETTING_STARTED.md)
- 📖 **Documentation**: [Complete Docs](docs/INDEX.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/grunnverk/audio-tools/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/grunnverk/audio-tools/discussions)
- ❓ **FAQ**: [Frequently Asked Questions](docs/FAQ.md)

## 📊 Changelog

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for version history and changes.

---

<div align="center">

Made with ❤️ by [Tim O'Brien](https://github.com/grunnverk)

⭐ Star this repo if you find it useful!

</div>
