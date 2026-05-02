# Forest Focus 🌲🐰

A production-ready digital detox Pomodoro app built with React, TypeScript, and Tailwind CSS.

## The Concept
"Forest Focus" turns your attention into a living ecosystem. By focusing, you grow a barren land into a lush forest. By resting, you invite bunny families to move in. By straying, you face the storm.

## Features
- **Dynamic State Machine**: Handles `IDLE`, `FOCUSING`, `BREAK`, `STORM`, and `RECOVERY`.
- **Ecosystem Growth**:
  - Forest grows (0-100%) during focus sessions.
  - Bunny family unlocks at 20%, 50%, and 80% milestones.
  - **Scars**: Permanent visual reminders of sessions where you got distracted but returned.
  - **Winter Mode**: A "no-guilt" penalty. If grace expires, next session growth is 30% slower.
- **Distraction Detection**:
  - Automatically enters `STORM` state if you switch tabs or stop interacting with the app.
  - 10-minute grace period to return.
- **Persistence**: Stats and settings saved to LocalStorage.
- **Responsive & Accessible**: Minimal modern UI, keyboard-friendly controls, and ARIA live regions.

## How it works (The Rules)
1. **Starting**: Click "Start Focus". The sun rises and trees begin to grow.
2. **Distraction**: If you switch tabs, the sky darkens and a storm begins. You have X minutes (configurable) to return.
3. **Recovery**: If you return during the storm, your forest recovers but keeps a "scar".
4. **Completion**: Complete the timer to see your forest bloom and bunnies jump!

## Setup & Local Run
This app is built with Vite.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## Folder Structure
- `src/App.tsx`: Main logic and state management.
- `src/hooks.ts`: Custom hooks for Timer, Visibility, Inactivity, and LocalStorage.
- `src/components/`:
  - `ForestScene.tsx`: Visual SVG/Tailwind representation of the forest.
  - `TimerDisplay.tsx`: The countdown and main controls.
  - `SettingsModal.tsx`: Configuration for durations.
- `src/types.ts`: TypeScript interfaces and enums.

## Future Plans (v2)
- Soundscapes (Fireplace, Rain, Wind).
- Different biomes (Desert, Tundra).
- Export stats as a data report.
- Syncing across devices with Firebase.
