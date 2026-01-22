/**
 * Countdown Timer Demo
 *
 * This example demonstrates the visual countdown timer
 * that can be used before starting recordings
 */

/* eslint-disable no-console */

import {
    CountdownTimer,
    startCountdown,
    createAudioRecordingCountdown
} from '@grunnverk/audio-tools';

async function demoBasicCountdown() {
    console.log('Demo 1: Basic Countdown\n');
    console.log('Starting 10-second countdown...\n');

    await startCountdown({
        durationSeconds: 10,
        beepAt30Seconds: false,
        redAt30Seconds: false,
    });

    console.log('✅ Countdown complete!\n');
}

async function demoCountdownWithCallbacks() {
    console.log('Demo 2: Countdown with Callbacks\n');
    console.log('Starting 15-second countdown with tick callbacks...\n');

    let tickCount = 0;

    await startCountdown({
        durationSeconds: 15,
        beepAt30Seconds: false,
        redAt30Seconds: true,
        onTick: (remaining) => {
            tickCount++;
            // You can perform actions on each tick
            if (remaining === 10) {
                console.log('\n⚠️  10 seconds remaining!');
            }
            if (remaining === 5) {
                console.log('\n⚠️  5 seconds remaining!');
            }
        },
        onComplete: () => {
            console.log(`\n✅ Countdown complete! (${tickCount} ticks)`);
        }
    });

    console.log();
}

async function demoAudioRecordingCountdown() {
    console.log('Demo 3: Audio Recording Countdown (45 seconds)\n');
    console.log('This countdown includes:');
    console.log('  • Visual countdown with colors');
    console.log('  • Beep warning at 30 seconds');
    console.log('  • Red color when time is low\n');

    const timer = createAudioRecordingCountdown(45);
    await timer.start();

    console.log('✅ Recording time expired!\n');
}

async function demoManualControl() {
    console.log('Demo 4: Manual Timer Control\n');
    console.log('Starting a 20-second timer that we can stop early...\n');

    const timer = new CountdownTimer({
        durationSeconds: 20,
        beepAt30Seconds: false,
        redAt30Seconds: true,
        onTick: (remaining) => {
            // Auto-stop at 10 seconds
            if (remaining === 10) {
                console.log('\n⏹️  Stopping timer early...');
                timer.stop();
            }
        }
    });

    await timer.start();
    console.log('✅ Timer stopped\n');
}

async function main() {
    console.clear();
    console.log('🕐 Countdown Timer Demos');
    console.log('========================\n');

    // Run demos sequentially
    await demoBasicCountdown();
    await sleep(1000);

    await demoCountdownWithCallbacks();
    await sleep(1000);

    await demoAudioRecordingCountdown();
    await sleep(1000);

    await demoManualControl();

    console.log('All demos complete!');
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);

