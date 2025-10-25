import { Accidental } from "./base"

const NAMES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]
const NAMES_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
]

type Accidental = typeof Accidental.SHARP | typeof Accidental.FLAT

export const getNoteName = (
  midiNumber: number,
  accidental: Accidental = Accidental.SHARP,
) => {
  const index = midiNumber % 12
  return accidental === Accidental.SHARP
    ? NAMES_SHARP[index]
    : NAMES_FLAT[index]
}

export const getOctave = (midiNumber: number) => {
  return Math.floor(midiNumber / 12) - 1
}

export const getRandomNoteName = (midiNumber: number) => {
  const accidental = Math.random() < 0.5 ? Accidental.SHARP : Accidental.FLAT

  return getNoteName(midiNumber, accidental)
}
