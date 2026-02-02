

# Birthday Celebration Feature for February 26th

## Overview
Implement an automatic birthday celebration mode that activates only on February 26th. When visitors arrive on this special date, they will be greeted with:
- A festive confetti animation covering the screen
- A "Happy Birthday Spot!" message overlay
- Auto-playing happy birthday music (with user consent for audio)
- A dismiss button to close the celebration and view the normal site

On all other days, the website displays normally with no changes.

---

## How It Works

1. When the site loads, the system checks if today's date is February 26th
2. If it is February 26th:
   - A full-screen birthday overlay appears with confetti
   - A "Happy Birthday Spot!" message displays with festive styling
   - A play button allows visitors to hear the birthday song
   - Visitors can dismiss the overlay to continue browsing
3. If it's any other day, the site loads normally with no celebration

---

## Technical Implementation

### 1. Date Detection Utility
Create a simple utility function to check if the current date is February 26th:

```text
src/utils/birthdayUtils.ts
- isBirthday(): boolean function
- Checks if current month = February (1) and day = 26
```

### 2. Birthday Celebration Component
A new React component that handles the entire celebration:

```text
src/components/BirthdayCelebration.tsx
- Manages visibility state (shown/dismissed)
- Canvas-based confetti animation
- Birthday message with festive styling
- Play/Stop music button
- Dismiss button to close overlay
- Uses localStorage to remember if dismissed today
```

### 3. Birthday Music Generation
Use Lovable AI to generate a cheerful happy birthday instrumental:

```text
supabase/functions/generate-birthday-music/index.ts
- POST endpoint that generates birthday music
- Uses ElevenLabs Music API via Lovable AI
- Returns audio as base64 or binary
- Caches the generated music for reuse
```

### 4. Integration with Index Page
Conditionally render the celebration component:

```text
src/pages/Index.tsx
- Import BirthdayCelebration component
- Only render when isBirthday() returns true
- Positioned as an overlay above all content
```

---

## Visual Design

The celebration will feature:
- Dark semi-transparent backdrop over the site
- Colorful confetti particles falling from top
- Large "Happy Birthday Spot!" text with gradient styling
- A cute paw print or birthday cake icon
- Teal-themed colors matching the brand palette
- Smooth fade-in/out animations

---

## User Experience Considerations

1. **Audio Consent**: Music only plays when the user clicks "Play Music" - no auto-play to respect browser policies
2. **One-Time Dismissal**: Once dismissed, the celebration won't reappear until the user refreshes (or optionally for the rest of the day via localStorage)
3. **Non-Intrusive**: Clear "Continue to Site" button for visitors who want to skip
4. **Accessible**: Proper ARIA labels and keyboard navigation support
5. **Performance**: Confetti uses efficient canvas rendering, not DOM elements

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/utils/birthdayUtils.ts` | Create | Date checking utility |
| `src/components/BirthdayCelebration.tsx` | Create | Main celebration component with confetti |
| `src/hooks/useBirthdayMusic.ts` | Create | Hook for generating/playing music |
| `supabase/functions/generate-birthday-music/index.ts` | Create | Backend function for music generation |
| `src/pages/Index.tsx` | Modify | Add conditional celebration rendering |
| `src/index.css` | Modify | Add confetti animation keyframes |

