# Architecture Documentation

## Overview

`@grunnverk/audio-tools` is designed as a modular, platform-agnostic audio recording and transcription toolkit for Node.js. This document explains the architectural decisions and design patterns used in the library.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Application                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              @grunnverk/audio-tools (Public API)            │
├─────────────────────────────────────────────────────────────┤
│  Recording  │  Devices   │  Countdown  │  Transcription    │
│  Module     │  Module    │  Module     │  Module           │
└──────┬──────┴──────┬─────┴──────┬──────┴──────┬────────────┘
       │             │            │              │
       ▼             ▼            │              ▼
┌──────────────┐ ┌────────────┐  │    ┌──────────────────┐
│ @theunwalked │ │ @theunwalked│  │    │ @grunnverk/      │
│ /unplayable  │ │ /unplayable │  │    │ ai-service       │
│ (Recording)  │ │ (Devices)   │  │    │ (Whisper API)    │
└──────────────┘ └────────────┘  │    └──────────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │  Node.js     │
                          │  Process     │
                          │  (stdout)    │
                          └──────────────┘
```

## Core Modules

### 1. Recording Module (`recording.ts`)

**Responsibilities:**
- Audio recording orchestration
- File management and archiving
- Timestamped filename generation
- Cleanup operations

**Key Functions:**
- `recordAudio()` - Main recording function
- `archiveAudio()` - Archive audio with transcripts
- `deleteAudio()` - Safe file deletion
- `getTimestampedFilename()` - Filename generation

**Dependencies:**
- `@theunwalked/unplayable` - Platform-specific audio capture
- `@grunnverk/shared` - Logging utilities

**Design Patterns:**
- **Facade Pattern**: Simplifies interaction with `unplayable`
- **Factory Pattern**: Generates timestamped filenames
- **Error Handling**: Graceful degradation with detailed error messages

### 2. Devices Module (`devices.ts`)

**Responsibilities:**
- Audio device enumeration
- Device selection (interactive and programmatic)
- Default device detection

**Key Functions:**
- `listAudioDevices()` - List available devices
- `getDefaultDevice()` - Get system default
- `findDevice()` - Find by ID or name
- `selectDeviceInteractive()` - Interactive CLI selection

**Dependencies:**
- `@theunwalked/unplayable` - Platform audio device APIs

**Design Patterns:**
- **Strategy Pattern**: Different device selection strategies
- **Adapter Pattern**: Wraps platform-specific APIs

**Note:** Device listing is currently limited by `unplayable` capabilities. Interactive selection is the recommended approach.

### 3. Countdown Module (`countdown.ts`)

**Responsibilities:**
- Visual countdown timers
- ANSI terminal manipulation
- Audio beeps and visual warnings
- Resource cleanup

**Key Components:**

#### `CountdownTimer` Class

**State Management:**
```typescript
{
  currentSeconds: number;        // Remaining time
  intervalId: NodeJS.Timeout;    // Timer handle
  hasBeepedAt30: boolean;        // Beep tracking
  isFirstDisplay: boolean;       // Display state
  supportsAnsi: boolean;         // Terminal capability
  isDestroyed: boolean;          // Cleanup state
}
```

**Lifecycle:**
1. **Construction**: Initialize options, detect terminal capabilities
2. **Start**: Begin countdown, set up interval
3. **Tick**: Update display, check for warnings, call callbacks
4. **Stop**: Clear interval, final display update
5. **Destroy**: Remove event listeners, cleanup resources

**Design Patterns:**
- **Observer Pattern**: Callbacks for tick and completion
- **State Pattern**: Manages timer lifecycle states
- **Singleton-like**: One active timer per instance
- **Resource Management**: RAII-style cleanup

**Terminal Handling:**
- Detects ANSI support via `process.stdout.isTTY`
- Fallback to plain text for non-TTY environments
- In-place updates using ANSI cursor control
- Color-coded warnings (cyan → red)

### 4. Transcription Module (`transcription.ts`)

**Responsibilities:**
- Audio-to-text conversion
- Error handling and retries
- Progress logging

**Key Functions:**
- `transcribeAudio()` - Wrapper around AI service

**Dependencies:**
- `@grunnverk/ai-service` - OpenAI Whisper integration

**Design Patterns:**
- **Wrapper/Facade**: Simplifies AI service API
- **Error Translation**: Converts service errors to domain errors

## Data Flow

### Recording Flow

```
User Call
    ↓
recordAudio(options)
    ↓
├─→ Validate options
├─→ Apply defaults
├─→ Initialize unplayable
│   └─→ Select device (if needed)
├─→ Start recording
│   ├─→ Monitor duration
│   └─→ Wait for user stop (ENTER)
├─→ Stop recording
├─→ Get file stats
└─→ Return RecordingResult
```

### Transcription Flow

```
Audio File
    ↓
transcribeAudio(path)
    ↓
├─→ Validate file exists
├─→ Call AI service
│   └─→ Upload to OpenAI
│       └─→ Whisper API processing
├─→ Receive transcription
└─→ Return text
```

### Archive Flow

```
Audio + Transcript
    ↓
archiveAudio(path, text, dir)
    ↓
├─→ Generate timestamped filenames
│   ├─→ Format: YYMMdd-HHmm-name.ext
│   └─→ Example: 250701-1430-review-audio.wav
├─→ Create output directory
├─→ Copy audio file
├─→ Write transcript (Markdown)
│   ├─→ Header with metadata
│   └─→ Transcription content
└─→ Return paths
```

## Error Handling Strategy

### Hierarchical Error Handling

```
Application Level
    ↓
Module Level (audio-tools)
    ↓
Service Level (unplayable, ai-service)
    ↓
Platform Level (OS APIs)
```

### Error Categories

1. **User Errors**
   - Invalid options
   - Missing required parameters
   - Invalid file paths

2. **System Errors**
   - No audio devices
   - Permission denied
   - Disk full

3. **Service Errors**
   - API key invalid
   - Network timeout
   - Service unavailable

4. **Resource Errors**
   - File not found
   - Out of memory
   - Device busy

### Error Handling Patterns

```typescript
try {
  // Operation
} catch (error) {
  // Log detailed error
  logger.error('OPERATION_FAILED:', error);

  // Cleanup resources
  await cleanup();

  // Throw user-friendly error
  throw new Error(`Operation failed: ${error.message}`);
}
```

## Logging Architecture

### Log Levels

- **error**: Critical failures
- **warn**: Recoverable issues
- **info**: Important events
- **debug**: Detailed diagnostic information

### Structured Logging Format

```typescript
logger.info('OPERATION_COMPLETE: Description | Metric1: value | Metric2: value');
```

### Logger Injection

- Uses dependency injection pattern
- Defaults to console logger
- Configurable via `setLogger()`
- Optional peer dependency on winston

## Type System

### Core Interfaces

```typescript
// Public API types
interface RecordingOptions { /* ... */ }
interface RecordingResult { /* ... */ }
interface AudioDevice { /* ... */ }
interface CountdownOptions { /* ... */ }

// Internal types
type DeviceId = string;
type AudioFormat = 'wav' | 'mp3' | 'flac';
type SampleRate = 16000 | 44100 | 48000;
```

### Type Safety

- Strict TypeScript configuration
- No implicit `any`
- Exhaustive switch statements
- Runtime type validation for external inputs

## Platform Abstraction

### Audio Backend Abstraction

```
audio-tools API
    ↓
@theunwalked/unplayable
    ↓
┌─────────┬──────────┬──────────┐
│  macOS  │  Linux   │ Windows  │
└─────────┴──────────┴──────────┘
│         │          │
CoreAudio ALSA/PA    WASAPI
```

### Terminal Abstraction

- Detects terminal capabilities
- Falls back to plain text
- Handles different `TERM` values
- Respects `NO_COLOR` environment

## Performance Considerations

### Memory Management

- Streaming audio data (not buffered in memory)
- Automatic cleanup of temporary files
- Timer interval cleanup
- Event listener removal

### CPU Usage

- Countdown updates: 1 Hz (low overhead)
- Recording: Handled by native audio libraries
- Transcription: External API (no local CPU)

### I/O Optimization

- Direct file writes (no intermediate buffers)
- Async file operations
- Minimal file system operations

## Security Considerations

### File System

- User-specified paths validated
- No arbitrary file access
- Secure temporary file creation
- Proper file permissions

### API Keys

- Environment variable storage
- Not logged or exposed
- Passed securely to services

### Process Safety

- Cleanup on SIGINT/SIGTERM
- No zombie processes
- Proper resource disposal

## Testing Strategy

### Unit Tests

- Test individual functions in isolation
- Mock external dependencies
- Cover edge cases and error paths
- Fast execution

### Integration Tests

- Test module interactions
- Use real file system operations
- Verify cleanup behavior
- May require audio hardware

### Mocking Strategy

```typescript
// Mock unplayable
vi.mock('@theunwalked/unplayable', () => ({
  processAudio: vi.fn().mockResolvedValue({
    audioFilePath: '/tmp/test.wav',
    cancelled: false
  })
}));
```

## Future Architecture Considerations

### Planned Enhancements

1. **Device Enumeration**
   - Full device listing API
   - Device capability detection
   - Hot-plug device support

2. **Audio Processing**
   - Real-time audio level metering
   - Silence detection
   - Automatic gain control

3. **Format Support**
   - More codec options (AAC, Opus)
   - Bitrate configuration
   - Compression settings

4. **Streaming**
   - Stream audio to services
   - Real-time transcription
   - WebSocket support

5. **Advanced Timers**
   - Multiple simultaneous timers
   - Pause/resume functionality
   - Custom display formats

## Extensibility Points

### Custom Loggers

Implement Winston-compatible logger interface:

```typescript
interface Logger {
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}
```

### Custom Audio Processors

Future support for processing pipelines:

```typescript
interface AudioProcessor {
  process(audioBuffer: Buffer): Promise<Buffer>;
}
```

### Custom Transcription Services

Potential for pluggable transcription:

```typescript
interface TranscriptionService {
  transcribe(audioPath: string): Promise<string>;
}
```

## Dependency Management

### Direct Dependencies

- `@theunwalked/unplayable` - Core audio functionality
- `@grunnverk/ai-service` - Transcription

### Peer Dependencies

- `winston` - Optional logging
- `@grunnverk/shared` - Optional utilities

### Version Strategy

- Semantic versioning (SemVer)
- Conservative dependency updates
- Regular security audits
- Lock file committed to repo

## Build and Distribution

### Build Process

```
TypeScript Source (src/)
    ↓
    TypeScript Compiler (tsc)
    ↓
    Vite (bundling)
    ↓
JavaScript + Declarations (dist/)
    ├── index.js
    ├── index.d.ts
    └── src/**/*.js, *.d.ts
```

### Distribution

- Published to npm
- ESM modules only
- Type declarations included
- Source maps for debugging

## Conclusion

The architecture of `@grunnverk/audio-tools` prioritizes:

1. **Simplicity** - Easy to use, hard to misuse
2. **Modularity** - Clear separation of concerns
3. **Extensibility** - Plugin points for customization
4. **Reliability** - Robust error handling
5. **Performance** - Efficient resource usage
6. **Compatibility** - Cross-platform support

This design enables developers to quickly integrate audio recording and transcription into their applications while maintaining flexibility for advanced use cases.

