import type { PianoNote } from "../piano/base"

export interface PianoSheet {
  /**
   * Highlight the note on the sheet
   * @param note The note to highlight
   */
  highlightNote(note: PianoNote, duration?: number): Promise<void>
  /**
   * Add the note to the sheet
   * @param note The note to add
   */
  addNote(note: PianoNote): void
  /**
   * Clear the sheet, remove all notes
   */
  clear(): void
}
