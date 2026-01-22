# Frequently Asked Questions (FAQ)

## General Questions

### What is @grunnverk/audio-tools?

`@grunnverk/audio-tools` is a TypeScript library for recording, transcribing, and managing audio in Node.js applications. It's designed for developers who want to add voice-driven features to their applications.

### What platforms are supported?

- ✅ **macOS** - Full support via CoreAudio
- ✅ **Linux** - Full support via ALSA/PulseAudio
- ✅ **Windows** - Full support via WASAPI

### Do I need an OpenAI API key?

Only if you want to use the transcription features. Recording and device management work without an API key.

### Is this library free?

Yes, the library itself is open source under Apache-2.0 license. However:
- OpenAI's Whisper API charges per minute of audio
- Current pricing: ~$0.006 per minute

### Can I use this in production?

Yes! The library is designed for production use with:
- Comprehensive error handling
- Resource cleanup
- Type safety
- Test coverage

## Installation Questions

### Why do I need to install Winston separately?

Winston is an optional peer dependency. This keeps the library lightweight for users who don't need logging or prefer other loggers.

### What version of Node.js do I need?

Node.js 18.x or later. We recommend using the latest LTS version.

### Can I use this with JavaScript (not TypeScript)?

Absolutely! The library works perfectly with plain JavaScript:

```javascript
// Works fine without TypeScript
import { recordAudio } from '@grunnverk/audio-tools';

const result = await recordAudio({ duration: 60 });
console.log('Recorded:', result.filePath);
```

### Does this work with CommonJS (require)?

No, this is an ESM-only package. You need:

```json
{
  "type": "module"
}
```

in your `package.json`.

## Recording Questions

### How do I choose which microphone to use?

Use the interactive device selector:

```javascript
import { selectDeviceInteractive, recordAudio } from '@grunnverk/audio-tools';

const device = await selectDeviceInteractive();
const result = await recordAudio();
```

### Can I record indefinitely?

Yes, omit the `duration` option and press ENTER to stop manually:

```javascript
const result = await recordAudio(); // Records until ENTER pressed
```

### What audio formats are supported?

Currently:
- **WAV** (default) - Uncompressed, high quality
- **MP3** - Compressed, smaller files
- **FLAC** - Lossless compression

### How do I change the sample rate?

```javascript
const result = await recordAudio({
  sampleRate: 48000 // 16000, 44100, or 48000
});
```

### Why is my recording file so large?

WAV files are uncompressed. Use MP3 for smaller files:

```javascript
const result = await recordAudio({
  format: 'mp3' // Much smaller than WAV
});
```

### Can I record in stereo?

Currently, the library records in mono. Stereo support is planned for a future release.

### How do I record from a specific application (not microphone)?

This requires system audio capture (loopback recording), which is not currently supported. You would need additional tools like:
- macOS: BlackHole
- Linux: PulseAudio monitors
- Windows: Virtual audio cables

## Transcription Questions

### How accurate is the transcription?

Very accurate! We use OpenAI's Whisper API, which is state-of-the-art for speech recognition. Accuracy depends on:
- Audio quality
- Background noise
- Speaker clarity
- Language and accent

### What languages are supported?

Whisper supports 50+ languages including:
- English, Spanish, French, German
- Chinese, Japanese, Korean
- Arabic, Hindi, Russian
- And many more!

### How long does transcription take?

Typically 10-30 seconds for a 1-minute recording, depending on:
- Audio file size
- Network speed
- OpenAI API load

### Can I transcribe existing audio files?

Yes!

```javascript
import { transcribeAudio } from '@grunnverk/audio-tools';

const transcript = await transcribeAudio('./my-audio.mp3');
```

### What's the maximum audio file size?

OpenAI's Whisper API limits files to 25 MB. For longer recordings:

1. Use MP3 format (smaller)
2. Split into chunks
3. Lower sample rate (16000 Hz is fine for speech)

### Can I transcribe offline?

No, transcription requires the OpenAI API. For offline transcription, consider:
- Running Whisper locally (using Python)
- Other offline speech-to-text solutions

### How much does transcription cost?

OpenAI Whisper pricing (as of 2024):
- $0.006 per minute of audio
- 1 hour of audio = $0.36
- Very affordable for most use cases!

## Countdown Timer Questions

### Can I disable the countdown before recording?

Yes:

```javascript
const result = await recordAudio({
  countdownDelay: 0 // No countdown
});
```

### Why doesn't the countdown show colors in my terminal?

Your terminal might not support ANSI escape codes. The library falls back to plain text automatically.

### Can I customize the countdown display?

Yes, use the `CountdownTimer` class:

```javascript
import { CountdownTimer } from '@grunnverk/audio-tools';

const timer = new CountdownTimer({
  durationSeconds: 30,
  beepAt30Seconds: false, // No beep
  redAt30Seconds: false,  // No color change
  onTick: (remaining) => {
    // Custom display
    console.log(`${remaining} seconds left!`);
  }
});

await timer.start();
```

### Can I have multiple timers running?

Yes, each `CountdownTimer` instance is independent:

```javascript
const timer1 = new CountdownTimer({ durationSeconds: 30 });
const timer2 = new CountdownTimer({ durationSeconds: 60 });

// Run simultaneously
await Promise.all([
  timer1.start(),
  timer2.start()
]);
```

## Device Questions

### Why does `listAudioDevices()` return empty?

The underlying library (`@theunwalked/unplayable`) doesn't expose a direct device listing API. Use `selectDeviceInteractive()` instead, which provides a menu-based selection.

### How do I remember the user's device choice?

Save the device ID:

```javascript
import { selectDeviceInteractive } from '@grunnverk/audio-tools';
import { writeFile, readFile } from 'fs/promises';

// First time
const device = await selectDeviceInteractive();
await writeFile('device-preference.txt', device);

// Later
const savedDevice = await readFile('device-preference.txt', 'utf8');
// Use savedDevice for recording
```

Note: `@theunwalked/unplayable` also saves preferences in `~/.unplayable/audio-preferences.json`.

### My Bluetooth headset isn't detected

Ensure the headset is:
1. Paired and connected
2. Set as input device in system settings
3. Not in "headphones only" mode

Try unplugging/reconnecting or restarting your application.

## Error Handling Questions

### How do I catch errors?

Use try-catch:

```javascript
try {
  const result = await recordAudio({ duration: 60 });
} catch (error) {
  console.error('Recording failed:', error.message);
  // Handle error appropriately
}
```

### What errors can occur?

Common errors:

| Error | When | Solution |
|-------|------|----------|
| `No audio device` | No microphone | Connect device |
| `Permission denied` | No mic access | Grant in settings |
| `Recording cancelled` | User cancelled | Normal flow |
| `Transcription failed` | API error | Check key/network |
| `File not found` | Invalid path | Check file exists |

### How do I enable debug logging?

```javascript
import { setLogger } from '@grunnverk/audio-tools';
import { createLogger, transports } from 'winston';

setLogger(createLogger({
  level: 'debug', // Enable all logs
  transports: [new transports.Console()]
}));
```

## Archive Questions

### What format are archived transcripts in?

Markdown (.md) format with metadata:

```markdown
# Audio Transcription Archive

**Original Audio File:** /path/to/audio.wav
**Archived:** 2024-07-01T14:30:00.000Z

## Transcription

[Your transcribed text here...]
```

### Can I customize the archive filename format?

Currently, the format is fixed: `YYMMdd-HHmm-review-audio.wav`

For custom filenames, copy the file after archiving:

```javascript
const archive = await archiveAudio(audio, text, 'output');
await copyFile(archive.audioPath, 'my-custom-name.wav');
```

### Where are archives saved?

Default: `output/` directory in your current working directory.

Specify custom directory:

```javascript
await archiveAudio(audio, transcript, '/path/to/archives');
```

### Can I archive without transcription?

Yes, pass an empty string:

```javascript
await archiveAudio(audioPath, '', 'output');
```

The transcript file will be created but contain no transcription content.

## Performance Questions

### Why is recording using so much CPU?

Audio recording itself uses minimal CPU. If you see high usage:
1. Check for other processes
2. Verify no audio processing plugins
3. Try lower sample rate (16000 Hz)

### Can I record multiple channels simultaneously?

No, currently only mono recording is supported. This is a limitation of the underlying audio library.

### How much memory does recording use?

Very little! Audio is streamed directly to disk, not buffered in memory. Expect < 50 MB memory usage even for long recordings.

### Why is transcription slow?

Transcription speed depends on:
1. **Network**: API calls need internet
2. **File size**: Larger files take longer
3. **API load**: OpenAI server load

To speed up:
- Use MP3 instead of WAV (smaller uploads)
- Use faster internet connection
- Lower sample rate for speech (16kHz is fine)

## Integration Questions

### Can I use this in an Electron app?

Yes! Audio-tools works in Electron's main process:

```javascript
// main.js
import { recordAudio } from '@grunnverk/audio-tools';

ipcMain.handle('record-audio', async () => {
  const result = await recordAudio({ duration: 60 });
  return result;
});
```

### Can I use this in a web application?

No, this is a Node.js library for the backend. For browser recording:
- Use Web Audio API
- MediaRecorder API
- Consider sending audio to your backend for transcription

### Can I use this with Express/Fastify?

Absolutely! Create API endpoints:

```javascript
import express from 'express';
import { recordAudio, transcribeAudio } from '@grunnverk/audio-tools';

const app = express();

app.post('/api/record', async (req, res) => {
  try {
    const result = await recordAudio({ duration: 60 });
    const transcript = await transcribeAudio(result.filePath);
    res.json({ transcript });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Can I use this with Discord bots?

Yes, but you'll need to:
1. Use Discord.js voice features to capture audio
2. Save the audio to a file
3. Use `transcribeAudio()` to process it

```javascript
// Simplified example
const recording = connection.receiver.subscribe(user.id);
// ... save recording to file ...
const transcript = await transcribeAudio(audioFile);
```

## Development Questions

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### How do I run tests?

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test          # With coverage
```

### Where is the documentation?

- **README.md** - Main documentation
- **docs/GETTING_STARTED.md** - Tutorial
- **docs/ARCHITECTURE.md** - Technical details
- **docs/FAQ.md** - This file!
- **examples/** - Code examples

### How do I report bugs?

Open an issue on [GitHub Issues](https://github.com/grunnverk/audio-tools/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, Node version)

## Licensing Questions

### What license is this under?

Apache-2.0 License - very permissive!

You can:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Sublicense

### Can I use this in a closed-source project?

Yes! Apache-2.0 allows use in proprietary software.

### Do I need to credit the library?

Not required, but appreciated! You can add to your project's credits:

```
Uses @grunnverk/audio-tools
https://github.com/grunnverk/audio-tools
```

## Advanced Questions

### Can I use a custom transcription service?

Not directly, but you can:

```javascript
import { recordAudio } from '@grunnverk/audio-tools';

// Record with audio-tools
const recording = await recordAudio({ duration: 60 });

// Use your own transcription
const transcript = await myCustomTranscriptionService(recording.filePath);
```

### Can I access raw audio data?

Not directly from this library. For raw audio processing:
1. Record to a file
2. Use a library like `node-wav` or `fluent-ffmpeg` to process

### Can I stream audio in real-time?

Not currently. The library records to files. For streaming:
- Consider `node-microphone` or similar
- Process with streaming audio APIs

### Can I convert between audio formats?

Use external tools:

```javascript
import ffmpeg from 'fluent-ffmpeg';
import { recordAudio } from '@grunnverk/audio-tools';

const recording = await recordAudio({ format: 'wav' });

// Convert to MP3
ffmpeg(recording.filePath)
  .toFormat('mp3')
  .save('output.mp3');
```

## Troubleshooting

### I get "Cannot find module" errors

Ensure you have:

```json
{
  "type": "module"
}
```

in your `package.json` for ESM support.

### Microphone permission denied

**macOS:**
```
System Preferences → Security & Privacy → Privacy → Microphone
```

**Windows:**
```
Settings → Privacy → Microphone
```

**Linux:**
```bash
# Check PulseAudio permissions
pulseaudio --check
```

### Recording produces no sound

1. **Test microphone** in system settings
2. **Check levels** - mic not muted?
3. **Try different device** via `selectDeviceInteractive()`
4. **Enable debug logging** to see errors

### Transcription returns empty string

- Check audio file is not silent
- Verify API key is correct
- Ensure audio format is supported
- Check file size < 25 MB

## Still Have Questions?

- 💬 **Ask on Discussions**: [GitHub Discussions](https://github.com/grunnverk/audio-tools/discussions)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/grunnverk/audio-tools/issues)
- 📧 **Email**: tobrien@discursive.com

---

*Last updated: December 2024*

