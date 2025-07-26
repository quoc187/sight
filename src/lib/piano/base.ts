import { Note } from "webmidi"

export const Accidental = {
  SHARP: "#",
  FLAT: "b",
  NATURAL: "n",
}

export const MIDI_NUMBER_MIN = 0
export const MIDI_NUMBER_MAX = 127

/**
 * The number of white keys in an octave
 */
export const OCTAVE_WHITE_KEY_COUNT = 7

/**
 * The number of black keys in an octave
 */
export const OCTAVE_BLACK_KEY_COUNT = 5

/**
 * The number of notes in an octave
 *
 * - 12 notes in an octave
 * - 7 white keys
 * - 5 black keys
 */
export const OCTAVE_NOTE_COUNT = 12

/**
 * The index of the white keys in an octave(0-indexed)
 */
export const WHITE_KEY_INDEX = [0, 2, 4, 5, 7, 9, 11]

/**
 * The index of the black keys in an octave(0-indexed)
 */
export const BLACK_KEY_INDEX = [1, 3, 6, 8, 10]

export const NOTE_NAME_TO_INDEX = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
  "C#": 1,
  "D#": 3,
  "F#": 6,
  "G#": 8,
  "A#": 10,
}

export const INDEX_TO_NOTE_NAME = Object.fromEntries(
  Object.entries(NOTE_NAME_TO_INDEX).map(([name, index]) => [index, name]),
) as Record<number, string>

export class PianoNote {
  private _note: Note
  private _isBlackKey: boolean

  /**
   * @param midiNumberOrName The midi number or name of the note
   *
   * - name: ${note}${accidental or empty}${octave}
   * - midiNumber: 0-127
   *
   * @example
   * new PianoNote("C4") // C4
   * new PianoNote("C#4") // C#4
   * new PianoNote(60) // C4
   */
  constructor(midiNumberOrName: number | string) {
    this._note = new Note(midiNumberOrName)
    this._isBlackKey = BLACK_KEY_INDEX.includes(
      this._note.number % OCTAVE_NOTE_COUNT,
    )
  }

  /**
   * Clone the note
   */
  clone() {
    return new PianoNote(this._note.number)
  }

  /**
   * Get the full name of the note
   */
  get fullName() {
    return `${this._note.name}${this._note.accidental || ""}${this._note.octave}`
  }

  /**
   * Get the name of the note
   */
  get name() {
    return this._note.name
  }

  /**
   * Get the midi number of the note
   */
  get midiNumber() {
    return this._note.number
  }

  /**
   * Get the octave of the note
   */
  get octave() {
    return this._note.octave
  }

  /**
   * Get the accidental of the note
   */
  get accidental() {
    return this._note.accidental || undefined
  }

  /**
   * Check if the note is a black key
   */
  get isBlackKey() {
    return this._isBlackKey
  }

  /**
   * Check if the note is the same as the other note
   *
   * @param other The other note to compare to
   * @param strict If true, the notes must be the same octave
   * @returns True if the notes are the same, false otherwise
   */
  isEqual(other: PianoNote, strict = false) {
    if (strict) {
      return this.midiNumber === other.midiNumber
    }

    return (this.midiNumber - other.midiNumber) % OCTAVE_NOTE_COUNT === 0
  }
}

const constrainMidiNumber = (midiNumber: number) => {
  return Math.max(Math.min(midiNumber, MIDI_NUMBER_MAX), MIDI_NUMBER_MIN)
}

const sortNumbers = (a: number, b: number) => {
  return a > b ? [b, a] : [a, b]
}

/**
 * Get the notes in a range
 *
 * @param startMidiNumber The start midi number
 * @param endMidiNumber The end midi number
 * @returns The notes in the range(inclusive)
 */
export const notesInRange = (
  startMidiNumber: number,
  endMidiNumber: number,
) => {
  const notes = []
  const [start, end] = sortNumbers(
    constrainMidiNumber(startMidiNumber),
    constrainMidiNumber(endMidiNumber),
  )

  for (let i = start; i <= end; i++) {
    notes.push(new PianoNote(i))
  }

  return notes
}

/**
 * Get the notes in an octave
 *
 * @param octave The octave(-1, 0, 1, 2, ...)
 * @returns The notes in the octave
 */
export const getNotesInOctave = (octave: number) => {
  const start = (octave + 1) * OCTAVE_NOTE_COUNT
  const end = start + OCTAVE_NOTE_COUNT - 1

  console.log(start, end)

  return notesInRange(start, end)
}

/**
 * Get the number of white keys in a range
 *
 * You can use it to calculate the width of the piano
 *
 * @param start The start midi number
 * @param end The end midi number
 * @returns The number of white keys in the range
 */
export const numberOfWhiteKeysInRange = (
  startMidiNumber: number,
  endMidiNumber: number,
) => {
  const [start, end] = sortNumbers(
    constrainMidiNumber(startMidiNumber),
    constrainMidiNumber(endMidiNumber),
  )

  const whiteKeys = new Set([0, 2, 4, 5, 7, 9, 11])
  let count = 0

  for (let i = start; i <= end; i++) {
    if (whiteKeys.has(i % 12)) {
      count++
    }
  }

  return count
}
