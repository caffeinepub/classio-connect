# Classio Connect

## Current State
- 15 modules in student dashboard, all accessible via `activeModuleLesson` state
- `handleModuleComplete` is a `useCallback` that calls `setActiveModuleLesson(null)` at the end
- Each module shows a "Complete Lesson" button only after completing ALL steps (e.g., VocabularyModule requires completing all 4 word matches)
- ConversationModule: character text responses are displayed but there is NO text-to-speech — characters never speak out loud
- `isSpeaking` state animates the character for 2200ms but no `speechSynthesis.speak()` is called

## Requested Changes (Diff)

### Add
- Text-to-speech to ConversationModule: when character (Lexi) sends a message, use `window.speechSynthesis` to speak it aloud. Cancel any ongoing speech before speaking new message. Add a speaker icon to toggle TTS on/off. On/off state saved in component state.
- A visible fallback "Skip to Complete" or persistent "Complete Lesson" button in ALL 9 modules that appears after the student has done at least minimal interaction (e.g., after first activity attempt), so students are never stuck.

### Modify
- All 9 modules (Vocabulary, Grammar, Pronunciation, Listening, Conversation, Reading, Shadowing, AI Roleplay, Picture Speaking): Ensure the Complete Lesson button is always reachable. Add a secondary "Complete Lesson" button (smaller, muted style) visible after the first activity step, so students can complete even if they get stuck on matching/recording/etc.
- ConversationModule `sendText`: after adding Lexi's message, call `speechSynthesis.speak(new SpeechSynthesisUtterance(lexiText))` to speak the character's response. Cancel previous speech first.
- ConversationModule initial greeting: also speak the initial message via TTS when a character is selected.

### Remove
- Nothing removed

## Implementation Plan
1. In `ConversationModule.tsx`:
   - Add `ttsEnabled` state (default true)
   - Add `speakText(text: string)` helper that cancels current speech and speaks new text if ttsEnabled
   - Call `speakText(lexiMsg.text)` inside `sendText` after building lexiMsg
   - Call `speakText(initMsg)` in `startWithCharacter`
   - Cancel speech on component unmount via useEffect cleanup
   - Add a speaker toggle button (🔊/🔇) in the character panel header
2. In each of the 9 modules, add a secondary escape/complete button:
   - Show a small "Complete Lesson" button (variant='outline', smaller) that appears after first meaningful interaction
   - This ensures students who are stuck (e.g., can't do recording, can't complete matching game) can always exit
   - Track `hasInteracted` boolean state, set to true on first button click / first answer attempt
3. Validate and deploy
