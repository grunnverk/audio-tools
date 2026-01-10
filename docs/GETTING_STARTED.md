# Getting Started with @eldrforge/audio-tools

This guide will walk you through your first audio recording and transcription using `@eldrforge/audio-tools`.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Your First Recording](#your-first-recording)
4. [Adding Transcription](#adding-transcription)
5. [Working with Devices](#working-with-devices)
6. [Using Countdown Timers](#using-countdown-timers)
7. [Archiving Recordings](#archiving-recordings)
8. [Error Handling](#error-handling)
9. [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x or later
  ```bash
  node --version  # Should show v18.x or higher
  ```

- **npm**: Usually comes with Node.js
  ```bash
  npm --version
  ```

- **Audio Input**: A working microphone or audio input device

- **OpenAI API Key**: Only needed for transcription features
  - Sign up at [OpenAI](https://platform.openai.com/)
  - Generate an API key from [API Keys page](https://platform.openai.com/api-keys)

## Installation

### For a New Project

Create a new Node.js project:

```bash
mkdir my-audio-app
cd my-audio-app
npm init -y
```

Install audio-tools:

```bash
npm install @eldrforge/audio-tools
```

Install optional dependencies:

```bash
npm install winston  # For logging
npm install dotenv   # For environment variables
```

### For an Existing Project

Simply add audio-tools to your project:

```bash
npm install @eldrforge/audio-tools
```

### TypeScript Setup (Optional)

If using TypeScript:

```bash
npm install --save-dev typescript @types/node
npx tsc --init
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "lib": ["ES2020"],
    "esModuleInterop": true
  }
}
```

Update `package.json`:

```json
{
  "type": "module"
}
```

## Your First Recording

Let's create a simple script to record audio.

### Create `record.js`

```javascript
import { recordAudio } from '@eldrforge/audio-tools';

async function main() {
  console.log('🎙️  Starting recording...');
  console.log('Press ENTER to stop\n');

  try {
    const result = await recordAudio({
      duration: 60, // Max 60 seconds
    });

    console.log('\n✅ Recording complete!');
    console.log(`📁 Saved to: ${result.filePath}`);
    console.log(`⏱️  Duration: ${result.duration.toFixed(2)} seconds`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

### Run It

```bash
node record.js
```

You should see:
1. A 3-second countdown
2. Recording indicator
3. "Press ENTER to stop" message
4. Final recording details

### Understanding the Output

The recording is saved to:
```
output/recording-[timestamp].wav
```

For example:
```
output/recording-1703175432123.wav
```

## Adding Transcription

Now let's transcribe the recorded audio using OpenAI's Whisper API.

### Set Up API Key

Create a `.env` file:

```bash
echo "OPENAI_API_KEY=sk-your-actual-api-key" > .env
```

**Important**: Never commit `.env` files to version control!

Add to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### Create `transcribe.js`

```javascript
import { recordAudio, transcribeAudio } from '@eldrforge/audio-tools';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Please set OPENAI_API_KEY in .env file');
    process.exit(1);
  }

  console.log('🎙️  Record your message...\n');

  try {
    // Step 1: Record
    const recording = await recordAudio({
      duration: 120, // Max 2 minutes
    });

    console.log('\n✅ Recording complete');
    console.log('📝 Transcribing...\n');

    // Step 2: Transcribe
    const transcript = await transcribeAudio(recording.filePath);

    console.log('✅ Transcription:\n');
    console.log('─'.repeat(60));
    console.log(transcript);
    console.log('─'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

### Run It

```bash
npm install dotenv
node transcribe.js
```

Say something into your microphone, press ENTER, and watch it transcribe!

## Working with Devices

List and select audio input devices:

### Create `devices.js`

```javascript
import {
  listAudioDevices,
  getDefaultDevice,
  selectDeviceInteractive
} from '@eldrforge/audio-tools';

async function main() {
  console.log('🎤 Audio Devices\n');

  // Method 1: List devices
  const devices = await listAudioDevices();

  if (devices.length > 0) {
    console.log('Available devices:');
    devices.forEach((device, i) => {
      const marker = device.isDefault ? ' ⭐ (default)' : '';
      console.log(`  ${i + 1}. ${device.name}${marker}`);
    });
  }

  // Method 2: Get default
  const defaultDevice = await getDefaultDevice();
  if (defaultDevice) {
    console.log(`\nDefault: ${defaultDevice.name}`);
  }

  // Method 3: Interactive selection
  console.log('\n📋 Interactive selection...');
  const selected = await selectDeviceInteractive();
  console.log(`✅ Selected: ${selected}`);
}

main();
```

### Run It

```bash
node devices.js
```

## Using Countdown Timers

Add visual countdown timers to your recordings:

### Create `countdown.js`

```javascript
import {
  CountdownTimer,
  recordAudio
} from '@eldrforge/audio-tools';

async function main() {
  console.log('🎬 Recording with Countdown\n');

  // Pre-recording countdown
  console.log('Get ready...\n');
  const countdown = new CountdownTimer({
    durationSeconds: 5,
    beepAt30Seconds: false,
    redAt30Seconds: false,
    onTick: (remaining) => {
      if (remaining === 3) {
        console.log('  3...');
      }
    },
    onComplete: () => {
      console.log('  🎙️  Recording NOW!\n');
    }
  });

  await countdown.start();

  // Record with time limit countdown
  const result = await recordAudio({
    duration: 30,
    countdownDelay: 0, // Skip internal countdown
  });

  console.log('\n✅ Done!');
  console.log(`📁 ${result.filePath}`);
}

main();
```

### Run It

```bash
node countdown.js
```

## Archiving Recordings

Save recordings and transcripts with timestamps:

### Create `archive.js`

```javascript
import {
  recordAudio,
  transcribeAudio,
  archiveAudio,
  deleteAudio
} from '@eldrforge/audio-tools';
import { config } from 'dotenv';

config();

async function main() {
  let tempAudio = null;

  try {
    // Record
    console.log('🎙️  Recording...\n');
    const recording = await recordAudio({ duration: 60 });
    tempAudio = recording.filePath;

    // Transcribe
    console.log('\n📝 Transcribing...\n');
    const transcript = await transcribeAudio(tempAudio);
    console.log('✅ Transcript ready\n');

    // Archive
    console.log('💾 Archiving...\n');
    const archive = await archiveAudio(
      tempAudio,
      transcript,
      'my-archives'
    );

    console.log('✅ Archived!');
    console.log(`🎵 Audio: ${archive.audioPath}`);
    console.log(`📄 Text:  ${archive.transcriptPath}`);

    // Clean up temp file
    await deleteAudio(tempAudio);
    console.log('\n🧹 Temporary file deleted');

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Cleanup on error
    if (tempAudio) {
      await deleteAudio(tempAudio).catch(() => {});
    }

    process.exit(1);
  }
}

main();
```

### Run It

```bash
node archive.js
```

This creates files like:
```
my-archives/
  ├── 250701-1430-review-audio.wav
  └── 250701-1430-review-transcript.md
```

## Error Handling

Always handle errors gracefully:

### Best Practices

```javascript
import { recordAudio } from '@eldrforge/audio-tools';

async function robustRecording() {
  try {
    const result = await recordAudio({
      duration: 60,
    });

    return result;

  } catch (error) {
    // Check error type
    if (error.message.includes('device')) {
      console.error('❌ Audio device error');
      console.error('   Check your microphone is connected');
    } else if (error.message.includes('permission')) {
      console.error('❌ Permission denied');
      console.error('   Grant microphone access in system settings');
    } else {
      console.error('❌ Recording failed:', error.message);
    }

    throw error; // Re-throw if needed
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| No audio device | No microphone found | Connect audio input device |
| Permission denied | Microphone access blocked | Grant permissions in OS settings |
| File already exists | Output path in use | Choose different path or delete file |
| API key invalid | Wrong OpenAI key | Check OPENAI_API_KEY value |
| Network error | No internet | Check connection for transcription |

## Next Steps

### Explore Examples

Check out the `examples/` directory for more:

```bash
cd node_modules/@eldrforge/audio-tools/examples
npm install
npm run basic          # Basic recording
npm run transcribe     # Full workflow
npm run countdown      # Timer demos
```

### Add Logging

Configure Winston logger for better debugging:

```javascript
import { setLogger } from '@eldrforge/audio-tools';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'audio.log' })
  ]
});

setLogger(logger);

// Now all audio-tools operations will log
```

### Build Something Cool

Ideas for projects:

- 📝 **Voice Note App**: Quick voice memos with transcription
- 🎙️ **Podcast Recorder**: Record and archive podcast episodes
- 💬 **Meeting Transcriber**: Capture and transcribe meetings
- 🎵 **Audio Diary**: Daily audio journal with search
- 🤖 **Voice Commands**: Process voice for automation
- 📚 **Interview Tool**: Record and transcribe interviews

### Read More

- [API Reference](../README.md#-api-reference) - Complete API documentation
- [Architecture](./ARCHITECTURE.md) - Design and internals
- [Examples](../examples/README.md) - More code examples
- [Contributing](../CONTRIBUTING.md) - Help improve the library

## Troubleshooting

### Recording Not Working

1. **Check microphone**:
   ```bash
   # macOS
   system_profiler SPAudioDataType

   # Linux
   arecord -l

   # Windows
   # Check Sound settings
   ```

2. **Test permissions**:
   - macOS: System Preferences → Security & Privacy → Microphone
   - Linux: Check PulseAudio/ALSA permissions
   - Windows: Settings → Privacy → Microphone

3. **Enable debug logging**:
   ```javascript
   import { setLogger } from '@eldrforge/audio-tools';
   import winston from 'winston';

   setLogger(winston.createLogger({
     level: 'debug',
     transports: [new winston.transports.Console()]
   }));
   ```

### Transcription Not Working

1. **Verify API key**:
   ```bash
   echo $OPENAI_API_KEY
   ```

2. **Test API key**:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

3. **Check audio format**:
   - Whisper supports: WAV, MP3, FLAC, M4A, etc.
   - Max file size: 25 MB
   - If too large, split or compress

### Performance Issues

1. **Large files**: Use MP3 format instead of WAV
2. **Slow transcription**: Check network speed
3. **Memory issues**: Process files in batches

## Getting Help

- 💬 **Questions**: [GitHub Discussions](https://github.com/grunnverk/audio-tools/discussions)
- 🐛 **Bugs**: [GitHub Issues](https://github.com/grunnverk/audio-tools/issues)
- 📖 **Docs**: [Full Documentation](../README.md)

---

**Congratulations!** 🎉 You're now ready to build voice-powered applications with `@eldrforge/audio-tools`.

Happy coding! 🚀

