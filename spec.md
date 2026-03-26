# Classio Connect

## Current State
- ConversationModule uses emoji (🦩) as the AI character avatar
- Login pages exist but may have issues with actor connection causing login failures
- Report card exists but may lack graphical charts/details
- All three login flows (student/teacher/admin) are implemented

## Requested Changes (Diff)

### Add
- Animated human character selector in ConversationModule (Boy, Girl, Teacher) with CSS/SVG animation — full-body human avatar rendered in React (no emoji)
- Character speaks visually: avatar has a speaking animation when AI responds
- Report card: add bar charts and pie/radial charts using recharts showing scores per module, accuracy %, and performance breakdown
- Detailed report card: show per-module score, total questions, accuracy %, performance remark, date

### Modify
- ConversationModule: replace 🦩 emoji with selectable animated human character (boy/girl/teacher SVG avatars with wave/speak animations)
- Login pages: ensure actor connection is robust — add retry logic and clearer loading state so login doesn't fail silently when actor isn't ready
- StudentDashboard report section: add recharts BarChart and RadialBarChart visualizations
- TeacherDashboard reports tab: same graphical enhancements

### Remove
- Nothing removed

## Implementation Plan
1. Create AnimatedCharacter component with SVG human avatars (boy/girl/teacher), speaking animation using CSS keyframes
2. Update ConversationModule to show character selector at start and display animated character during chat
3. Update StudentDashboard report section with recharts charts (BarChart for module scores, RadialBarChart for overall accuracy)
4. Update TeacherDashboard reports with same chart approach
5. Fix login: add actor readiness check with better UX — show spinner while connecting, auto-retry on actor load
