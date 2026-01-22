# Documentation Index

Complete documentation for `@grunnverk/audio-tools`.

## 📚 Documentation Structure

### Getting Started
- **[README.md](../README.md)** - Main documentation with features, installation, and API reference
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step tutorial for beginners
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - One-page cheat sheet for common tasks

### Examples & Guides
- **[Examples Directory](../examples/)** - Runnable code examples
  - Basic recording
  - Record and transcribe
  - Countdown timer demos
  - Device selection
  - Custom output paths
- **[CLI_EXAMPLES.md](./CLI_EXAMPLES.md)** - Build command-line tools with audio-tools

### Deep Dives
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, patterns, and internals
- **[FAQ.md](./FAQ.md)** - Frequently asked questions and troubleshooting

### Contributing
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - How to contribute to the project

## 📖 Documentation by Topic

### For Beginners

Start here if you're new to the library:

1. [README.md](../README.md) - Overview and features
2. [GETTING_STARTED.md](./GETTING_STARTED.md) - Your first recording
3. [Examples](../examples/) - Run practical examples
4. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Common patterns

### For Application Developers

Building apps with audio-tools:

1. [README.md - API Reference](../README.md#-api-reference) - Complete API
2. [Examples Directory](../examples/) - Integration examples
3. [CLI_EXAMPLES.md](./CLI_EXAMPLES.md) - CLI tools and scripts
4. [FAQ.md](./FAQ.md) - Common questions

### For Library Developers

Contributing or understanding internals:

1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Design and patterns
2. [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
3. [Source Code](../src/) - Implementation

## 🎯 Quick Links by Task

### Recording Audio

- [Quick Start: Basic Recording](../README.md#-quick-start)
- [Getting Started: Your First Recording](./GETTING_STARTED.md#your-first-recording)
- [API: recordAudio](../README.md#recordaudiooptions-recordingoptions-promiserecordingresult)
- [Example: Basic Recording](../examples/basic-recording.ts)
- [CLI Example: Simple Recorder](./CLI_EXAMPLES.md#simple-cli-recorder)

### Transcription

- [Quick Start: Record and Transcribe](../README.md#record-and-transcribe)
- [Getting Started: Adding Transcription](./GETTING_STARTED.md#adding-transcription)
- [API: transcribeAudio](../README.md#transcribeaudioaudiopath-string-promisestring)
- [Example: Record and Transcribe](../examples/record-and-transcribe.ts)
- [CLI Example: Transcription CLI](./CLI_EXAMPLES.md#audio-transcription-cli)
- [FAQ: Transcription Questions](./FAQ.md#transcription-questions)

### Device Management

- [Getting Started: Working with Devices](./GETTING_STARTED.md#working-with-devices)
- [API: Device Functions](../README.md#device-functions)
- [Example: Device Selection](../examples/device-selection.ts)
- [CLI Example: Device Selector](./CLI_EXAMPLES.md#interactive-device-selector)
- [FAQ: Device Questions](./FAQ.md#device-questions)

### Countdown Timers

- [Quick Start: Countdown Timer](../README.md#countdown-timer)
- [Getting Started: Using Countdown Timers](./GETTING_STARTED.md#using-countdown-timers)
- [API: CountdownTimer Class](../README.md#countdowntimer)
- [Example: Countdown Demo](../examples/countdown-demo.ts)
- [FAQ: Countdown Questions](./FAQ.md#countdown-timer-questions)

### Archiving

- [Quick Start: Archive](../README.md#record-and-transcribe)
- [Getting Started: Archiving Recordings](./GETTING_STARTED.md#archiving-recordings)
- [API: archiveAudio](../README.md#archiveaudioaudiopath-string-transcript-string-outputdir-string)
- [Example: Record and Transcribe](../examples/record-and-transcribe.ts)
- [FAQ: Archive Questions](./FAQ.md#archive-questions)

### Error Handling

- [Getting Started: Error Handling](./GETTING_STARTED.md#error-handling)
- [Quick Reference: Error Handling](./QUICK_REFERENCE.md#error-handling)
- [FAQ: Error Handling Questions](./FAQ.md#error-handling-questions)
- [Architecture: Error Strategy](./ARCHITECTURE.md#error-handling-strategy)

### Logging

- [API: Logging Functions](../README.md#logging)
- [Getting Started: Add Logging](./GETTING_STARTED.md#add-logging)
- [Architecture: Logging](./ARCHITECTURE.md#logging-architecture)

## 🔧 By Use Case

### Voice Notes App

**Relevant docs:**
- [Example: Record and Transcribe](../examples/record-and-transcribe.ts)
- [CLI Example: Voice Note CLI](./CLI_EXAMPLES.md#voice-note-cli)
- [Getting Started: Archive](./GETTING_STARTED.md#archiving-recordings)

### Podcast Recording

**Relevant docs:**
- [Example: Custom Output Path](../examples/custom-output-path.ts)
- [API: Recording Options](../README.md#recordaudiooptions-recordingoptions-promiserecordingresult)
- [FAQ: Recording Questions](./FAQ.md#recording-questions)

### Meeting Transcription

**Relevant docs:**
- [Example: Record and Transcribe](../examples/record-and-transcribe.ts)
- [CLI Example: Batch Transcription](./CLI_EXAMPLES.md#batch-transcription-tool)
- [Quick Reference: Record + Transcribe](./QUICK_REFERENCE.md#record--transcribe)

### Audio Documentation

**Relevant docs:**
- [Example: Record and Transcribe](../examples/record-and-transcribe.ts)
- [Getting Started: Archive](./GETTING_STARTED.md#archiving-recordings)
- [API: Archive Functions](../README.md#archiveaudioaudiopath-string-transcript-string-outputdir-string)

### CLI Tools

**Relevant docs:**
- [CLI Examples](./CLI_EXAMPLES.md) - Complete guide
- [Examples Directory](../examples/) - Runnable examples
- [Quick Reference](./QUICK_REFERENCE.md) - Common patterns

## 📋 By Skill Level

### Beginner

**Start here:**
1. [README.md](../README.md) - Overview
2. [GETTING_STARTED.md](./GETTING_STARTED.md) - Tutorial
3. [Basic Recording Example](../examples/basic-recording.ts)
4. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Cheat sheet

### Intermediate

**Build more:**
1. [All Examples](../examples/)
2. [CLI_EXAMPLES.md](./CLI_EXAMPLES.md)
3. [Complete API Reference](../README.md#-api-reference)
4. [FAQ.md](./FAQ.md)

### Advanced

**Deep understanding:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md)
2. [Source Code](../src/)
3. [Tests](../tests/)
4. [CONTRIBUTING.md](../CONTRIBUTING.md)

## 🔍 Search by Question

### "How do I...?"

- **...record audio?** → [Getting Started](./GETTING_STARTED.md#your-first-recording)
- **...transcribe audio?** → [Getting Started](./GETTING_STARTED.md#adding-transcription)
- **...select a microphone?** → [Getting Started](./GETTING_STARTED.md#working-with-devices)
- **...add a countdown?** → [Getting Started](./GETTING_STARTED.md#using-countdown-timers)
- **...save recordings?** → [Getting Started](./GETTING_STARTED.md#archiving-recordings)
- **...handle errors?** → [Getting Started](./GETTING_STARTED.md#error-handling)
- **...build a CLI tool?** → [CLI Examples](./CLI_EXAMPLES.md)
- **...reduce file size?** → [FAQ](./FAQ.md#recording-questions)
- **...configure logging?** → [Quick Reference](./QUICK_REFERENCE.md#configure-logging)
- **...process multiple files?** → [CLI Examples: Batch Tool](./CLI_EXAMPLES.md#batch-transcription-tool)

### "What is...?"

- **...RecordingOptions?** → [API Reference](../README.md#recordaudiooptions-recordingoptions-promiserecordingresult)
- **...CountdownTimer?** → [API Reference](../README.md#countdowntimer)
- **...the architecture?** → [Architecture](./ARCHITECTURE.md)
- **...the license?** → [README](../README.md#-license)

### "Why...?"

- **...is transcription slow?** → [FAQ](./FAQ.md#why-is-transcription-slow)
- **...is my file so large?** → [FAQ](./FAQ.md#why-is-my-recording-file-so-large)
- **...no devices found?** → [FAQ](./FAQ.md#why-does-listaudiodevices-return-empty)
- **...is Winston optional?** → [FAQ](./FAQ.md#why-do-i-need-to-install-winston-separately)

### "Can I...?"

- **...use this in production?** → [FAQ](./FAQ.md#can-i-use-this-in-production)
- **...use with JavaScript?** → [FAQ](./FAQ.md#can-i-use-this-with-javascript-not-typescript)
- **...record in stereo?** → [FAQ](./FAQ.md#can-i-record-in-stereo)
- **...transcribe offline?** → [FAQ](./FAQ.md#can-i-transcribe-offline)
- **...use in Electron?** → [FAQ](./FAQ.md#can-i-use-this-in-an-electron-app)

## 📦 Package Resources

- **npm**: [@grunnverk/audio-tools](https://www.npmjs.com/package/@grunnverk/audio-tools)
- **GitHub**: [grunnverk/audio-tools](https://github.com/grunnverk/audio-tools)
- **Issues**: [GitHub Issues](https://github.com/grunnverk/audio-tools/issues)
- **Discussions**: [GitHub Discussions](https://github.com/grunnverk/audio-tools/discussions)

## 💡 Suggested Reading Order

### First Time Users

1. [README.md](../README.md) - Get an overview
2. [GETTING_STARTED.md](./GETTING_STARTED.md) - Follow the tutorial
3. [Examples](../examples/) - Run the examples
4. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Keep as reference

### Building an Application

1. [README.md - API Reference](../README.md#-api-reference)
2. [Complete Example](../README.md#-complete-usage-example)
3. [Examples Directory](../examples/)
4. [FAQ.md](./FAQ.md) when you hit issues

### Building CLI Tools

1. [CLI_EXAMPLES.md](./CLI_EXAMPLES.md)
2. [Examples](../examples/)
3. [Quick Reference](./QUICK_REFERENCE.md)

### Contributing

1. [CONTRIBUTING.md](../CONTRIBUTING.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [Source Code](../src/)
4. [Tests](../tests/)

## 🆘 Getting Help

Can't find what you need?

1. **Check [FAQ.md](./FAQ.md)** - Common questions answered
2. **Search [Issues](https://github.com/grunnverk/audio-tools/issues)** - Someone may have asked before
3. **Ask in [Discussions](https://github.com/grunnverk/audio-tools/discussions)** - Community Q&A
4. **Open an Issue** - For bugs or feature requests
5. **Email**: tobrien@discursive.com - For sensitive topics

## 📝 Documentation Contributions

Found an error? Want to improve docs?

- Docs are in Markdown format
- Located in `/docs` and root directory
- See [CONTRIBUTING.md](../CONTRIBUTING.md)
- Pull requests welcome!

---

**Last updated**: December 2024

*Happy coding with audio-tools!* 🎉

