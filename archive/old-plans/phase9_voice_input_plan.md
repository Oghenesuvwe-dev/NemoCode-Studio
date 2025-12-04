# Phase 9: Voice Input (Accessibility) Implementation Plan

## Objective
Enable hands-free coding by allowing the user to speak to the IDE. The system should convert speech to text and populate the chat input.

## Features
1.  **Speech-to-Text (STT)**: Use the browser's native `Web Speech API` (SpeechRecognition) for converting voice to text.
2.  **Microphone Toggle**: A UI button in the chat interface to start/stop listening.
3.  **Visual Feedback**: Indicate when the system is listening (e.g., pulsing icon).

## Technical Approach

### Frontend (Tauri/React)
- **Hook**: Create `useSpeechRecognition.ts` hook to manage the `window.SpeechRecognition` or `window.webkitSpeechRecognition` instance.
- **UI**: Add a `Mic` icon to `RealChat.tsx` input area.
- **Logic**:
    - On click, start recognition.
    - On result, append text to the `prompt` state.
    - On end/error, stop listening and update UI state.

### Backend (Python)
- *Note*: For this phase, we will rely on the frontend's browser capabilities for STT to avoid heavy local dependencies like Whisper initially. If browser STT is insufficient, we can explore a local Whisper server later.

## Step-by-Step Implementation

1.  **Create Hook**: `src/hooks/useSpeechRecognition.ts`
    - Handle browser compatibility (Chrome/Safari/Webview).
    - Expose `start`, `stop`, `isListening`, `transcript`.

2.  **Update Chat UI**: `src/components/RealChat.tsx`
    - Import hook.
    - Add Mic button next to Send button.
    - Handle permission requests (browser will ask automatically).

3.  **Testing**
    - Verify microphone access in Tauri.
    - Test dictation accuracy.

## Future (Phase 9.5)
- **Wake Word**: "Hey Nemo" detection (requires continuous listening or local lightweight model like Porcupine, out of scope for simple MVP).
- **Voice Commands**: Parsing specific phrases like "Run tests" to trigger actions directly.
