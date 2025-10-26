import { type NoteMessageEvent, WebMidi } from "webmidi"

export class Midi {
  enabled = false

  async init() {
    return WebMidi.enable().then((m) => {
      this.enabled = true
      console.log("MIDI enabled")

      return this
    })
  }

  onNoteOn(callback: (note: NoteMessageEvent) => void) {
    const input = WebMidi.inputs[0]

    input.addListener("noteon", callback)

    return () => {
      input.removeListener("noteon", callback)
    }
  }

  get inputs() {
    return WebMidi.inputs
  }
}
