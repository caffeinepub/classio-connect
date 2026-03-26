# Classio Connect

## Current State
The platform has 14 learning modules in the student dashboard including Vocabulary, Grammar, Pronunciation, Listening, Conversation, Reading, Shadowing Practice, AI Roleplay, Picture Speaking, Fill-in-the-Conversation, Daily Speaking Streak, Timed Speaking Challenge, Word of the Day, and Weekly Voice Journal. The http-outcalls component is not yet selected.

## Requested Changes (Diff)

### Add
- **AI Content Discovery module** (15th module card): Powered by NVIDIA NV-Embed-v2, this module lets students type any English topic or question and get semantically matched learning content from a large embedded content library (500+ vocabulary words, grammar rules, reading passages, speaking prompts, listening exercises).
- **NVEmbedService utility**: A frontend service that simulates NV-Embed-v2 vector embeddings using TF-IDF cosine similarity across the content corpus. The NVIDIA API endpoint structure is wired and ready to accept a real `NVIDIA_API_KEY` env variable for live calls via http-outcalls backend.
- **ContentDiscoveryModule component**: Full interactive UI with a search bar, semantic results display with content type badges, "endless scroll" pagination of matched content, and a "Load More" button that fetches 10 more semantically ranked results.
- Backend http-outcalls support selected for future live NVIDIA API integration.

### Modify
- `StudentDashboard.tsx`: Add the new AI Content Discovery module card (15th) with a purple/violet glow matching NVIDIA's branding, and wire it to the new ContentDiscoveryModule component.
- `MODULE_GLOW` map: Add entry for "AI Content Discovery".

### Remove
- Nothing removed.

## Implementation Plan
1. Select `http-outcalls` component for future backend NVIDIA API calls.
2. Create `src/frontend/src/utils/nvEmbedService.ts` with the content corpus (500+ items across vocabulary, grammar, reading, speaking, listening categories) and cosine similarity search.
3. Create `src/frontend/src/components/modules/ContentDiscoveryModule.tsx` with search input, loading state, result cards, and endless load-more pagination.
4. Update `StudentDashboard.tsx`: add module entry for "AI Content Discovery", add to MODULES array, add to MODULE_GLOW, add the `renderModule()` case.
5. Validate and deploy.
