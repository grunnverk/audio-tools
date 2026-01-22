# @grunnverk/audio-tools - Agentic Guide

## Purpose

Audio recording tools for voice-driven development workflows. Enables voice note capture, device management, and transcription.

## Key Features

- **Audio Recording** - Record voice notes from command line
- **Device Management** - List and select audio input devices
- **Countdown Timer** - Visual countdown before recording starts
- **Transcription** - Convert audio to text via AI service
- **Cross-platform** - Works on macOS, Linux, and Windows

## Usage

```typescript
import { recordAudio, listDevices, transcribe } from '@grunnverk/audio-tools';

// List available devices
const devices = await listDevices();

// Record audio
const audioFile = await recordAudio({
  duration: 60,
  countdown: 3,
  device: devices[0]
});

// Transcribe
const text = await transcribe(audioFile);
```

## Dependencies

- @grunnverk/ai-service - Transcription via OpenAI
- @theunwalked/unplayable - Audio recording engine

## Package Structure

```
src/
├── recording.ts      # Audio recording
├── devices.ts        # Device management
├── countdown.ts      # Countdown timer
├── transcription.ts  # Audio transcription
├── types.ts          # Type definitions
└── index.ts
```

## Key Exports

- `recordAudio()` - Record audio from microphone
- `listDevices()` - List available audio devices
- `transcribe()` - Transcribe audio to text
- `countdown()` - Display countdown timer

