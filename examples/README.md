# Audio Tools Examples

This directory contains practical examples demonstrating how to use `@grunnverk/audio-tools`.

## Setup

1. Install dependencies:
```bash
cd examples
npm install
```

2. For transcription examples, create a `.env` file:
```bash
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

## Running Examples

### Basic Recording
Simple audio recording with default settings:
```bash
npm run basic
```

### Record and Transcribe
Record audio and transcribe it using OpenAI's Whisper API:
```bash
npm run transcribe
```
**Note:** Requires `OPENAI_API_KEY` in `.env` file

### Countdown Timer Demo
Demonstration of the visual countdown timer features:
```bash
npm run countdown
```

### Device Selection
Interactive audio device selection:
```bash
npm run devices
```

### Custom Output Path
Specify custom file paths for recordings:
```bash
npm run custom-path
```

## Examples Overview

| Example | File | Description |
|---------|------|-------------|
| Basic Recording | `basic-recording.ts` | Minimal example showing how to record audio |
| Record & Transcribe | `record-and-transcribe.ts` | Complete workflow: record, transcribe, and archive |
| Countdown Demo | `countdown-demo.ts` | Visual countdown timer demonstrations |
| Device Selection | `device-selection.ts` | List and select audio input devices |
| Custom Path | `custom-output-path.ts` | Specify custom output locations |

## Tips

- All examples include error handling and cleanup
- Press ENTER to stop recording manually (when no duration is hit)
- Logs are colored and formatted with winston for better readability
- Check the source code of each example for detailed comments

## Troubleshooting

**No audio devices found:**
- Ensure your system has audio input devices connected
- Check system permissions for microphone access

**Transcription fails:**
- Verify your `OPENAI_API_KEY` is valid
- Check your OpenAI account has credits available
- Ensure you have network connectivity

**Recording quality issues:**
- Try selecting a different audio device
- Check your device's sample rate settings
- Ensure no other applications are using the microphone

