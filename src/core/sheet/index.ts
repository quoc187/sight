import {
  Accidental,
  Formatter,
  RenderContext,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from "vexflow"
import { type PianoNote } from "../piano/base"
import type { PianoSheet } from "./base"

type SheetSizeConfig = {
  width: number
  height: number
  staveWidth: number
  staveSpace: number
}

class VPianoNote {
  private voice: Voice

  constructor(
    private note: PianoNote,
    private stave: Stave,
    private context: RenderContext,
  ) {
    const keys = [
      `${this.note.name}${this.note.accidental || ""}/${this.note.octave}`,
    ]
    const staveNote = new StaveNote({
      keys,
      duration: "w",
      clef: this.stave.getClef(),
    })

    if (this.note.accidental) {
      staveNote.addModifier(new Accidental(this.note.accidental))
    }

    // Create a voice in 4/4 and add above notes
    this.voice = new Voice({ numBeats: 1, beatValue: 1 })
    this.voice.addTickables([staveNote])

    this.voice.setStave(this.stave)

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([this.voice]).format([this.voice], 350)

    this.voice.setContext(this.context)
  }

  draw(): void {
    this.voice.drawWithStyle()
  }

  getSVGElement(): SVGElement | undefined {
    return this.voice.getTickables()[0].getSVGElement()
  }

  dispose(): void {
    this.getSVGElement()?.remove()
  }

  isSameNote(note: PianoNote): boolean {
    return this.note.isEqual(note)
  }
}

export class VexFlowPianoSheet implements PianoSheet {
  private context: RenderContext
  private trebleStave: Stave
  private bassStave: Stave
  private notes: VPianoNote[] = []

  constructor(element: HTMLDivElement, config: SheetSizeConfig) {
    const renderer = new Renderer(element, Renderer.Backends.SVG)
    const context = renderer.getContext()

    const trebleStave = new Stave(0, 0, config.staveWidth, {
      spacingBetweenLinesPx: config.staveSpace,
    })
    trebleStave.addClef("treble")
    trebleStave.setContext(context)

    const bassStave = new Stave(0, trebleStave.getHeight(), config.staveWidth, {
      spacingBetweenLinesPx: config.staveSpace,
    })
    bassStave.addClef("bass")
    bassStave.setContext(context)

    this.trebleStave = trebleStave
    this.bassStave = bassStave
    this.context = context

    renderer.resize(
      config.width,
      Math.max(
        config.height,
        trebleStave.getHeight() + bassStave.getHeight() + config.staveSpace * 5,
      ),
    )

    this.trebleStave.drawWithStyle()
    this.bassStave.drawWithStyle()
  }

  private getStavesForNote(note: PianoNote): Stave[] {
    console.log("choosing staves for note", note.midiNumber)
    if (note.midiNumber < 56) {
      return [this.bassStave]
    }

    if (note.midiNumber > 64) {
      return [this.trebleStave]
    }

    return [this.bassStave, this.trebleStave]
  }

  private getStaveForNote(note: PianoNote): Stave {
    const staves = this.getStavesForNote(note)
    const stave = staves[Math.floor(Math.random() * staves.length)]

    return stave
  }

  addNote(note: PianoNote): void {
    if (this.notes.some((n) => n.isSameNote(note))) {
      return
    }

    const stave = this.getStaveForNote(note)

    const vNote = new VPianoNote(note, stave, this.context)
    this.notes.push(vNote)

    vNote.draw()
  }

  highlightNote(note: PianoNote, durationMs?: number): void {
    const vNote = this.notes.find((n) => n.isSameNote(note))

    console.log(vNote)

    if (!vNote) {
      return
    }

    const d = durationMs ?? 500

    vNote.getSVGElement()?.animate(
      {
        fill: "red",
      },
      {
        duration: d,
        iterations: 4,
        easing: "ease-in-out",
      },
    )
  }

  clear(): void {
    this.notes.forEach((n) => n.dispose())
    this.notes = []
  }
}
