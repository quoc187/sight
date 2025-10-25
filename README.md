# Sight

Sight is a lightweight browser game for practicing sight-reading skills. It renders randomized sheet music and a virtual piano so you can drill note recognition at tempo. MIDI keyboard input is planned but not yet available.

- Practice rapid note identification with adaptive prompts
- Responsive interface tuned for desktop keyboards and touch devices
- Built with React, TypeScript, and Vite for fast iteration
- MIDI keyboard support coming soon

## Getting Started

```bash
pnpm install
pnpm dev
```

Open the local server URL from the terminal output (defaults to http://localhost:5173) and start playing.

## Scripts

- `pnpm dev` launches the development server with hot reload
- `pnpm build` generates a production build via Vite
- `pnpm preview` serves the production build locally for smoke testing
- `pnpm format` reformats the project with Biome

## Project Structure

- `src/Sheet` renders the current staff and manages note generation
- `src/components/piano` provides the on-screen keyboard UI
- `src/core` contains music theory helpers, rendering engines, and state machine logic

## Roadmap

- ✅ Virtual piano interactions and score rendering
- ⏳ MIDI keyboard detection and practice feedback
- ⏳ Expanded drill modes and streak tracking
- ⏳ Chord 

Contributions and feedback are welcome. File an issue or open a PR to propose changes.