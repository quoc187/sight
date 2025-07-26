import { OCTAVE_NOTE_COUNT, type PianoNote } from "./base"

export type PianoRendererConfig = {
  blackKeyWidth: number
  blackKeyHeight: number
  whiteKeyWidth: number
  whiteKeyHeight: number
  whiteKeyGap: number
}

export type NoteRenderConfig = {
  width: number
  height: number
  /**
   * The distance from the left edge of the note 0(C-1)
   */
  x: number
  zIndex: number
}

type KeyPosition = {
  /**
   * The white key index of this key
   * - If it's a black key, the white key index is the index of the white key before this key
   */
  whiteKeyIdx: number
}

/**
 * A map of key index to its position, order follow the piano keys
 */
const KEY_POS: KeyPosition[] = [
  // C
  {
    whiteKeyIdx: 0,
  },
  // C#
  {
    whiteKeyIdx: 0,
  },
  // D
  {
    whiteKeyIdx: 1,
  },
  // D#
  {
    whiteKeyIdx: 1,
  },
  // E
  {
    whiteKeyIdx: 2,
  },
  // F
  {
    whiteKeyIdx: 3,
  },
  // F#
  {
    whiteKeyIdx: 3,
  },
  // G
  {
    whiteKeyIdx: 4,
  },
  // G#
  {
    whiteKeyIdx: 4,
  },
  // A
  {
    whiteKeyIdx: 5,
  },
  // A#
  {
    whiteKeyIdx: 5,
  },
  // B
  {
    whiteKeyIdx: 6,
  },
]

const computeOctaveWidth = (options: PianoRendererConfig) => {
  return options.whiteKeyWidth * 7 + options.whiteKeyGap * 6
}

const computeNoteX = (
  note: PianoNote,
  octaveWidth: number,
  options: PianoRendererConfig,
) => {
  const { whiteKeyIdx } = KEY_POS[note.midiNumber % OCTAVE_NOTE_COUNT]
  // octave is -1 index because it starts from -1
  const octaveIdx = note.octave + 1

  // xpos = whiteKeyIdx * (whiteKeyWidth + whiteKeyGap) + octaveIdx * octaveWidth
  const whiteKeyX =
    whiteKeyIdx * (options.whiteKeyWidth + options.whiteKeyGap) +
    octaveIdx * octaveWidth

  if (note.isBlackKey) {
    return (
      whiteKeyX +
      options.whiteKeyWidth -
      options.blackKeyWidth / 2 +
      options.whiteKeyGap / 2
    )
  }

  return whiteKeyX
}

/**
 * Compute the notes config
 *
 * @param notes The notes to compute the config
 * @param options The options for the renderer
 * @returns The notes config
 */
export const computeNotesRenderConfig = (
  notes: PianoNote[],
  options: PianoRendererConfig,
): NoteRenderConfig[] => {
  const octaveWidth = computeOctaveWidth(options)

  return notes.map((note) => ({
    x: computeNoteX(note, octaveWidth, options),
    y: 0,
    width: note.isBlackKey ? options.blackKeyWidth : options.whiteKeyWidth,
    height: note.isBlackKey ? options.blackKeyHeight : options.whiteKeyHeight,
    zIndex: note.isBlackKey ? 1 : 0,
  }))
}

export type NoteWithConfig = {
  note: PianoNote
  config: NoteRenderConfig
}

/**
 * Compute the notes config and return an array of note config and the note itself
 *
 * @param notes The notes to compute the config
 * @param options The options for the renderer
 * @returns The notes position zipped by octave
 */
export const computeAndZipNotesPosition = (
  notes: PianoNote[],
  options: PianoRendererConfig,
): NoteWithConfig[] => {
  const noteConfig = computeNotesRenderConfig(notes, options)

  return noteConfig
    .sort((a, b) => a.x - b.x)
    .map((config, index) => ({
      note: notes[index],
      config,
    }))
}
