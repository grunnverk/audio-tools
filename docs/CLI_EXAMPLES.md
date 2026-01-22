# CLI Examples

This document shows how to use `@grunnverk/audio-tools` to build command-line tools.

## Table of Contents

1. [Simple CLI Recorder](#simple-cli-recorder)
2. [Voice Note CLI](#voice-note-cli)
3. [Audio Transcription CLI](#audio-transcription-cli)
4. [Interactive Device Selector](#interactive-device-selector)
5. [Batch Transcription Tool](#batch-transcription-tool)

## Simple CLI Recorder

Create `cli-record.js`:

```javascript
#!/usr/bin/env node

import { recordAudio } from '@grunnverk/audio-tools';
import { parseArgs } from 'util';

const { values } = parseArgs({
  options: {
    duration: {
      type: 'string',
      short: 'd',
      default: '60'
    },
    output: {
      type: 'string',
      short: 'o',
      default: 'output/recording.wav'
    },
    format: {
      type: 'string',
      short: 'f',
      default: 'wav'
    },
    help: {
      type: 'boolean',
      short: 'h'
    }
  }
});

if (values.help) {
  console.log(`
Usage: cli-record [options]

Options:
  -d, --duration <seconds>    Max recording duration (default: 60)
  -o, --output <path>         Output file path (default: output/recording.wav)
  -f, --format <format>       Audio format: wav, mp3, flac (default: wav)
  -h, --help                  Show this help

Examples:
  cli-record                          # Record with defaults
  cli-record -d 30 -o my-audio.wav   # Custom duration and output
  cli-record -f mp3                   # Record as MP3
  `);
  process.exit(0);
}

async function main() {
  const duration = parseInt(values.duration, 10);
  const { output, format } = values;

  console.log('🎙️  Audio Recorder');
  console.log(`Duration: ${duration}s | Format: ${format} | Output: ${output}\n`);

  try {
    const result = await recordAudio({
      duration,
      outputPath: output,
      format
    });

    console.log('\n✅ Recording complete!');
    console.log(`📁 Saved to: ${result.filePath}`);
    console.log(`⏱️  Duration: ${result.duration.toFixed(2)}s`);
    console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

Make it executable:

```bash
chmod +x cli-record.js
./cli-record.js --help
./cli-record.js -d 30 -o my-recording.mp3 -f mp3
```

## Voice Note CLI

Create `voice-note.js`:

```javascript
#!/usr/bin/env node

import {
  recordAudio,
  transcribeAudio,
  archiveAudio,
  deleteAudio
} from '@grunnverk/audio-tools';
import { parseArgs } from 'util';
import { config } from 'dotenv';

config();

const { values, positionals } = parseArgs({
  options: {
    duration: {
      type: 'string',
      short: 'd',
      default: '120'
    },
    archive: {
      type: 'string',
      short: 'a',
      default: 'voice-notes'
    },
    no-transcribe: {
      type: 'boolean'
    },
    help: {
      type: 'boolean',
      short: 'h'
    }
  },
  allowPositionals: true
});

if (values.help) {
  console.log(`
Voice Note CLI - Record and transcribe voice notes

Usage: voice-note [options] [title]

Arguments:
  title                       Optional title for the note

Options:
  -d, --duration <seconds>    Max recording duration (default: 120)
  -a, --archive <directory>   Archive directory (default: voice-notes)
  --no-transcribe             Skip transcription
  -h, --help                  Show this help

Environment:
  OPENAI_API_KEY             Required for transcription

Examples:
  voice-note "Meeting notes"
  voice-note -d 60 --no-transcribe
  voice-note "Project ideas" -a projects/notes
  `);
  process.exit(0);
}

async function main() {
  const title = positionals[0] || 'Voice Note';
  const duration = parseInt(values.duration, 10);
  const shouldTranscribe = !values['no-transcribe'];

  if (shouldTranscribe && !process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not set');
    console.error('   Set it in .env or use --no-transcribe');
    process.exit(1);
  }

  console.log(`🎙️  Recording: "${title}"\n`);
  console.log(`Max duration: ${duration}s`);
  console.log(`Archive: ${values.archive}`);
  console.log(`Transcribe: ${shouldTranscribe ? 'Yes' : 'No'}\n`);

  let tempAudio = null;

  try {
    // Record
    console.log('🔴 Recording... (Press ENTER to stop)\n');
    const recording = await recordAudio({ duration });
    tempAudio = recording.filePath;

    console.log(`✅ Recorded ${recording.duration.toFixed(2)}s\n`);

    let transcript = '';

    // Transcribe if enabled
    if (shouldTranscribe) {
      console.log('📝 Transcribing...\n');
      transcript = await transcribeAudio(tempAudio);

      console.log('✅ Transcription:\n');
      console.log('─'.repeat(60));
      console.log(transcript);
      console.log('─'.repeat(60));
      console.log();
    }

    // Archive
    console.log('💾 Archiving...\n');
    const archive = await archiveAudio(
      tempAudio,
      transcript || title,
      values.archive
    );

    console.log('✅ Archived!');
    console.log(`🎵 Audio: ${archive.audioPath}`);
    if (shouldTranscribe) {
      console.log(`📄 Text:  ${archive.transcriptPath}`);
    }

    // Cleanup
    await deleteAudio(tempAudio);
    console.log('\n🧹 Temporary file deleted');
    console.log('\n✨ Voice note saved successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (tempAudio) {
      await deleteAudio(tempAudio).catch(() => {});
    }

    process.exit(1);
  }
}

main();
```

Usage:

```bash
chmod +x voice-note.js

# Record with transcription
./voice-note.js "Project ideas"

# Quick recording without transcription
./voice-note.js --no-transcribe

# Custom duration
./voice-note.js "Meeting notes" -d 300
```

## Audio Transcription CLI

Create `transcribe-cli.js`:

```javascript
#!/usr/bin/env node

import { transcribeAudio } from '@grunnverk/audio-tools';
import { parseArgs } from 'util';
import { writeFile } from 'fs/promises';
import { config } from 'dotenv';

config();

const { values, positionals } = parseArgs({
  options: {
    output: {
      type: 'string',
      short: 'o'
    },
    quiet: {
      type: 'boolean',
      short: 'q'
    },
    help: {
      type: 'boolean',
      short: 'h'
    }
  },
  allowPositionals: true
});

if (values.help || positionals.length === 0) {
  console.log(`
Audio Transcription CLI

Usage: transcribe-cli [options] <audio-file>

Arguments:
  audio-file                  Path to audio file

Options:
  -o, --output <file>         Save transcript to file
  -q, --quiet                 Quiet mode (no output)
  -h, --help                  Show this help

Environment:
  OPENAI_API_KEY             Required

Examples:
  transcribe-cli recording.wav
  transcribe-cli audio.mp3 -o transcript.txt
  transcribe-cli *.wav        # Process multiple files
  `);
  process.exit(positionals.length === 0 ? 1 : 0);
}

async function transcribeFile(audioPath) {
  if (!values.quiet) {
    console.log(`📝 Transcribing: ${audioPath}`);
  }

  try {
    const transcript = await transcribeAudio(audioPath);

    if (values.output) {
      await writeFile(values.output, transcript, 'utf8');
      if (!values.quiet) {
        console.log(`✅ Saved to: ${values.output}\n`);
      }
    } else if (!values.quiet) {
      console.log('\n' + '─'.repeat(60));
      console.log(transcript);
      console.log('─'.repeat(60) + '\n');
    }

    return transcript;

  } catch (error) {
    console.error(`❌ Error transcribing ${audioPath}:`, error.message);
    throw error;
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not set');
    process.exit(1);
  }

  const audioFiles = positionals;

  try {
    for (const file of audioFiles) {
      await transcribeFile(file);
    }

    if (!values.quiet) {
      console.log(`✨ Processed ${audioFiles.length} file(s)`);
    }

  } catch (error) {
    process.exit(1);
  }
}

main();
```

Usage:

```bash
chmod +x transcribe-cli.js

# Transcribe single file
./transcribe-cli.js recording.wav

# Save to file
./transcribe-cli.js audio.mp3 -o transcript.txt

# Process multiple files
./transcribe-cli.js *.wav
```

## Interactive Device Selector

Create `select-device.js`:

```javascript
#!/usr/bin/env node

import {
  listAudioDevices,
  getDefaultDevice,
  selectDeviceInteractive
} from '@grunnverk/audio-tools';
import { writeFile } from 'fs/promises';

async function main() {
  console.log('🎤 Audio Device Selector\n');

  try {
    // Try to list devices
    const devices = await listAudioDevices();

    if (devices.length > 0) {
      console.log('Available devices:');
      devices.forEach((device, i) => {
        const marker = device.isDefault ? ' ⭐ (default)' : '';
        console.log(`  ${i + 1}. ${device.name}${marker}`);
        console.log(`     ID: ${device.id}`);
      });
      console.log();
    }

    // Show default
    const defaultDevice = await getDefaultDevice();
    if (defaultDevice) {
      console.log(`Default device: ${defaultDevice.name}\n`);
    }

    // Interactive selection
    console.log('Select your preferred device:\n');
    const selected = await selectDeviceInteractive();

    console.log(`\n✅ Selected: ${selected}`);

    // Save preference
    await writeFile('.audio-device', selected, 'utf8');
    console.log('💾 Saved to .audio-device');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

Usage:

```bash
chmod +x select-device.js
./select-device.js
```

## Batch Transcription Tool

Create `batch-transcribe.js`:

```javascript
#!/usr/bin/env node

import { transcribeAudio } from '@grunnverk/audio-tools';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { parseArgs } from 'util';
import { config } from 'dotenv';

config();

const { values, positionals } = parseArgs({
  options: {
    output: {
      type: 'string',
      short: 'o',
      default: 'transcripts'
    },
    extensions: {
      type: 'string',
      short: 'e',
      default: '.wav,.mp3,.flac,.m4a'
    },
    help: {
      type: 'boolean',
      short: 'h'
    }
  },
  allowPositionals: true
});

if (values.help || positionals.length === 0) {
  console.log(`
Batch Audio Transcription Tool

Usage: batch-transcribe [options] <directory>

Arguments:
  directory                   Directory containing audio files

Options:
  -o, --output <directory>    Output directory (default: transcripts)
  -e, --extensions <list>     Audio extensions (default: .wav,.mp3,.flac,.m4a)
  -h, --help                  Show this help

Environment:
  OPENAI_API_KEY             Required

Examples:
  batch-transcribe recordings/
  batch-transcribe audio/ -o outputs/
  batch-transcribe files/ -e ".wav,.mp3"
  `);
  process.exit(positionals.length === 0 ? 1 : 0);
}

async function findAudioFiles(directory, extensions) {
  const files = await readdir(directory);
  const extSet = new Set(extensions.split(',').map(e => e.trim()));

  return files
    .filter(file => extSet.has(extname(file).toLowerCase()))
    .map(file => join(directory, file));
}

async function transcribeFile(audioPath, outputDir) {
  const name = basename(audioPath, extname(audioPath));
  const outputPath = join(outputDir, `${name}.txt`);

  console.log(`📝 Processing: ${basename(audioPath)}`);

  try {
    const transcript = await transcribeAudio(audioPath);
    await writeFile(outputPath, transcript, 'utf8');

    console.log(`   ✅ Saved to: ${outputPath}`);

    return { success: true, file: audioPath };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, file: audioPath, error };
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not set');
    process.exit(1);
  }

  const inputDir = positionals[0];
  const outputDir = values.output;

  console.log('🎙️  Batch Transcription Tool\n');
  console.log(`Input:  ${inputDir}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Extensions: ${values.extensions}\n`);

  try {
    // Create output directory
    await mkdir(outputDir, { recursive: true });

    // Find audio files
    const audioFiles = await findAudioFiles(inputDir, values.extensions);

    if (audioFiles.length === 0) {
      console.log('⚠️  No audio files found');
      process.exit(0);
    }

    console.log(`Found ${audioFiles.length} audio file(s)\n`);

    // Process files
    const results = [];
    for (const file of audioFiles) {
      const result = await transcribeFile(file, outputDir);
      results.push(result);
      console.log(); // Blank line between files
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('─'.repeat(60));
    console.log(`✨ Complete: ${successful} successful, ${failed} failed`);

    if (failed > 0) {
      console.log('\nFailed files:');
      results
        .filter(r => !r.success)
        .forEach(r => console.log(`  ❌ ${basename(r.file)}`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

Usage:

```bash
chmod +x batch-transcribe.js

# Transcribe all audio in a directory
./batch-transcribe.js recordings/

# Custom output directory
./batch-transcribe.js audio/ -o transcripts/

# Specific file types
./batch-transcribe.js files/ -e ".wav,.mp3"
```

## Creating a Global CLI Tool

To make any of these scripts globally available:

1. **Add shebang line** (already included in examples):
   ```javascript
   #!/usr/bin/env node
   ```

2. **Update package.json**:
   ```json
   {
     "name": "my-audio-cli",
     "version": "1.0.0",
     "type": "module",
     "bin": {
       "voice-note": "./voice-note.js",
       "transcribe": "./transcribe-cli.js"
     },
     "dependencies": {
       "@grunnverk/audio-tools": "^0.1.8"
     }
   }
   ```

3. **Install globally**:
   ```bash
   npm link
   # or
   npm install -g .
   ```

4. **Use anywhere**:
   ```bash
   voice-note "My note"
   transcribe audio.wav
   ```

## Tips for CLI Development

### Progress Indicators

```javascript
import { createInterface } from 'readline';

function showProgress(message) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}`);
    i = (i + 1) % frames.length;
  }, 80);

  return () => {
    clearInterval(interval);
    process.stdout.write('\r');
  };
}

// Usage
const stop = showProgress('Transcribing...');
await transcribeAudio(file);
stop();
```

### Colorful Output

```javascript
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.green}✅ Success!${colors.reset}`);
console.log(`${colors.red}❌ Error!${colors.reset}`);
```

### Better Error Messages

```javascript
function handleError(error) {
  if (error.message.includes('OPENAI_API_KEY')) {
    console.error('❌ OpenAI API key missing');
    console.error('   Set OPENAI_API_KEY in your .env file');
    console.error('   Get a key at: https://platform.openai.com/');
  } else if (error.code === 'ENOENT') {
    console.error('❌ File not found');
    console.error(`   ${error.path}`);
  } else {
    console.error('❌ Error:', error.message);
  }
  process.exit(1);
}
```

## More Resources

- [Node.js util.parseArgs](https://nodejs.org/api/util.html#utilparseargsconfig)
- [Commander.js](https://www.npmjs.com/package/commander) - Full-featured CLI framework
- [Inquirer.js](https://www.npmjs.com/package/inquirer) - Interactive prompts
- [Chalk](https://www.npmjs.com/package/chalk) - Terminal colors
- [Ora](https://www.npmjs.com/package/ora) - Elegant spinners

---

**Happy CLI building!** 🚀

