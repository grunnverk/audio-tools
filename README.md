# @eldrforge/audio-tools

Audio recording tools for voice-driven development workflows.

## Overview

This package provides:
- Audio device detection and selection
- Audio recording with countdown
- Integration with transcription services
- Voice-driven workflow support

## Installation

```bash
npm install @eldrforge/audio-tools
```

## Dependencies

- `@theunwalked/unplayable` - Audio recording library
- `@eldrforge/ai-service` - For transcription (Whisper API)
- `@eldrforge/shared` - Optional utilities (peer dependency)
- `winston` - Optional logging (peer dependency)

## Usage

```typescript
import { recordAudio, listAudioDevices } from '@eldrforge/audio-tools';

// List available devices
const devices = await listAudioDevices();
console.log('Available devices:', devices);

// Record audio
const result = await recordAudio({
  duration: 30,
  countdownDelay: 3,
});

console.log('Audio recorded to:', result.filePath);
```

More documentation coming as functionality is extracted.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Platform Support

- ✅ macOS (CoreAudio)
- ✅ Linux (ALSA/PulseAudio)
- ✅ Windows (WASAPI)

Platform-specific requirements may apply.

## License

Apache-2.0

