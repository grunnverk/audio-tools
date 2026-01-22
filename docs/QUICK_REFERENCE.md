# Quick Reference Guide

One-page reference for common tasks with `@grunnverk/audio-tools`.

## Installation

```bash
npm install @grunnverk/audio-tools winston
```

## Imports

```javascript
import {
  // Recording
  recordAudio,
  archiveAudio,
  deleteAudio,

  // Devices
  selectDeviceInteractive,
  listAudioDevices,
  getDefaultDevice,

  // Transcription
  transcribeAudio,

  // Countdown
  CountdownTimer,
  startCountdown,
  createAudioRecordingCountdown,

  // Logging
  setLogger,
  getLogger
} from '@grunnverk/audio-tools';
```

## Common Tasks

### Record Audio

```javascript
// Basic recording
const result = await recordAudio({ duration: 60 });

// With options
const result = await recordAudio({
  duration: 120,           // Max 2 minutes
  countdownDelay: 3,       // 3-second countdown
  sampleRate: 48000,       // 48kHz
  format: 'mp3',           // MP3 format
  outputPath: 'out.mp3'    // Custom path
});
```

### Transcribe Audio

```javascript
// Requires OPENAI_API_KEY env var
const transcript = await transcribeAudio('audio.wav');
console.log(transcript);
```

### Record + Transcribe

```javascript
const recording = await recordAudio({ duration: 60 });
const transcript = await transcribeAudio(recording.filePath);
console.log(transcript);
```

### Archive Recording

```javascript
// Archive with transcript (timestamped)
const archive = await archiveAudio(
  'audio.wav',
  'Transcript text here',
  'output/archives'
);

// Creates:
// - 250701-1430-review-audio.wav
// - 250701-1430-review-transcript.md
```

### Select Audio Device

```javascript
// Interactive menu
const device = await selectDeviceInteractive();

// Get default device
const device = await getDefaultDevice();

// List all devices
const devices = await listAudioDevices();
```

### Countdown Timer

```javascript
// Quick countdown
await startCountdown({
  durationSeconds: 30,
  onComplete: () => console.log('Done!')
});

// Advanced countdown
const timer = new CountdownTimer({
  durationSeconds: 60,
  beepAt30Seconds: true,
  redAt30Seconds: true,
  onTick: (remaining) => {
    console.log(`${remaining}s left`);
  }
});
await timer.start();

// Audio recording countdown (with defaults)
const timer = createAudioRecordingCountdown(120);
await timer.start();
```

### Configure Logging

```javascript
import { setLogger } from '@grunnverk/audio-tools';
import { createLogger, transports } from 'winston';

const logger = createLogger({
  level: 'debug',
  transports: [new transports.Console()]
});

setLogger(logger);
```

## Types

### RecordingOptions

```typescript
interface RecordingOptions {
  device?: AudioDevice | string;
  duration?: number;
  outputPath?: string;
  countdownDelay?: number;
  sampleRate?: number;
  format?: 'wav' | 'mp3' | 'flac';
}
```

### RecordingResult

```typescript
interface RecordingResult {
  filePath: string;
  duration: number;
  fileSize: number;
}
```

### AudioDevice

```typescript
interface AudioDevice {
  id: string;
  name: string;
  isDefault: boolean;
}
```

### CountdownOptions

```typescript
interface CountdownOptions {
  durationSeconds: number;
  beepAt30Seconds?: boolean;
  redAt30Seconds?: boolean;
  onTick?: (remainingSeconds: number) => void;
  onComplete?: () => void;
  clearOnComplete?: boolean;
}
```

## Error Handling

```javascript
try {
  const result = await recordAudio({ duration: 60 });
} catch (error) {
  console.error('Recording failed:', error.message);
}
```

## Environment Variables

```bash
# Required for transcription
OPENAI_API_KEY=sk-your-key-here

# Optional: disable colors
NO_COLOR=1

# Optional: terminal type
TERM=xterm-256color
```

## Complete Example

```javascript
import {
  recordAudio,
  transcribeAudio,
  archiveAudio,
  deleteAudio,
  setLogger
} from '@grunnverk/audio-tools';
import { createLogger, format, transports } from 'winston';
import { config } from 'dotenv';

// Setup
config();
setLogger(createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
}));

async function main() {
  let audioPath = null;

  try {
    // Record
    console.log('🎙️  Recording...');
    const recording = await recordAudio({
      duration: 120,
      sampleRate: 48000
    });
    audioPath = recording.filePath;

    // Transcribe
    console.log('📝 Transcribing...');
    const transcript = await transcribeAudio(audioPath);
    console.log('Transcript:', transcript);

    // Archive
    console.log('💾 Archiving...');
    const archive = await archiveAudio(
      audioPath,
      transcript,
      'output/voice-notes'
    );
    console.log('Saved:', archive.audioPath);

    // Cleanup
    await deleteAudio(audioPath);
    console.log('✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (audioPath) {
      await deleteAudio(audioPath).catch(() => {});
    }
    process.exit(1);
  }
}

main();
```

## CLI Usage

### Record Command

```bash
node record.js
```

```javascript
import { recordAudio } from '@grunnverk/audio-tools';
const result = await recordAudio({ duration: 60 });
console.log('Saved:', result.filePath);
```

### Transcribe Command

```bash
node transcribe.js audio.wav
```

```javascript
import { transcribeAudio } from '@grunnverk/audio-tools';
const transcript = await transcribeAudio(process.argv[2]);
console.log(transcript);
```

## Tips

### Stop Recording Early

Press ENTER to stop recording before the duration limit.

### Reduce File Size

```javascript
// Use MP3 instead of WAV
const result = await recordAudio({
  format: 'mp3',
  sampleRate: 16000  // Lower sample rate for speech
});
```

### Process Multiple Files

```javascript
const files = ['a.wav', 'b.wav', 'c.wav'];

for (const file of files) {
  const transcript = await transcribeAudio(file);
  console.log(`${file}: ${transcript}`);
}
```

### Silent Countdown

```javascript
const result = await recordAudio({
  countdownDelay: 0  // No countdown
});
```

### Custom Timestamp Format

```javascript
import { getTimestampedArchivedAudioFilename } from '@grunnverk/audio-tools';

const filename = getTimestampedArchivedAudioFilename('.mp3');
// Returns: "250701-1430-review-audio.mp3"
```

## Platform-Specific Notes

### macOS

- Uses CoreAudio
- Requires microphone permissions in System Preferences
- Works with built-in mic and USB devices

### Linux

- Uses ALSA/PulseAudio
- May need to install `alsa-utils` or `pulseaudio`
- Check devices: `arecord -l`

### Windows

- Uses WASAPI
- Check microphone in Sound settings
- May need to allow microphone access in Privacy settings

## Common Issues

| Issue | Solution |
|-------|----------|
| No audio devices | Connect microphone, check permissions |
| Permission denied | Grant mic access in system settings |
| Transcription fails | Check OPENAI_API_KEY, verify network |
| File too large | Use MP3 format, lower sample rate |
| Empty transcript | Check audio not silent, verify format |

## More Resources

- [Full Documentation](../README.md)
- [Getting Started Guide](./GETTING_STARTED.md)
- [CLI Examples](./CLI_EXAMPLES.md)
- [FAQ](./FAQ.md)
- [Architecture](./ARCHITECTURE.md)

---

**Need help?** Open an issue on [GitHub](https://github.com/grunnverk/audio-tools/issues)

