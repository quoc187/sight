import { createActor, createMachine } from "xstate"
import type { PianoNote } from "../piano/base"

type PianoSheet = {
  highlightNode(note: PianoNote): void
}

type GameContext = {
  note: PianoNote
}

export const gameMachine = createMachine({
  id: "game",
  initial: "setup",
  states: {
    setup: {
      on: {
        PLAY: "playing",
      },
    },
    playing: {
      on: {
        STOP: "setup",
      },
    },
  },
  context: {
    notes: [],
  },
})

// Setup -> Playing
