import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Piano } from "@/components/piano"
import { Button } from "@/components/ui/button"
import { PianoNote } from "@/core/piano/base"
import { getOctave, getRandomNoteName } from "@/core/piano/utils"
import { VexFlowPianoSheet } from "@/core/sheet"
import { useMidi } from "./use-midi"
import type { PianoSheet } from "@/core/sheet/base"

const getSizeConfig = () => ({
  width: Math.min(window.innerWidth - 32, 500),
  height: Math.min(window.innerHeight, 200),
  staveWidth: Math.max(window.innerWidth, 500),
  staveSpace: 15,
})

type Props = {
  className?: string
}

const randomNote = () => {
  const midiNumber = Math.floor(Math.random() * 40) + 40

  return PianoNote.fromNameAndOctave(
    getRandomNoteName(midiNumber),
    getOctave(midiNumber),
  )
}

type Tracking = {
  total: number
  correct: number
}

const Sheet = ({ className }: Props) => {
  const sheetRef = useRef<PianoSheet | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const noteRef = useRef<PianoNote>(randomNote())
  const resultRef = useRef<HTMLParagraphElement | null>(null)
  const [tracking, setTracking] = useState<Tracking>({
    total: 0,
    correct: 0,
  })

  const updateNote = useCallback(() => {
    noteRef.current = randomNote()
    sheetRef.current?.clear()
    sheetRef.current?.addNote(noteRef.current)
  }, [])

  useEffect(() => {
    if (sheetRef.current) return
    if (!elRef.current) return
    const sheet = new VexFlowPianoSheet(elRef.current, getSizeConfig())
    sheetRef.current = sheet

    sheet.addNote(noteRef.current)
  }, [])

  const updateResult = useCallback((isCorrect: boolean, note: PianoNote) => {
    if (!resultRef.current) {
      return
    }

    resultRef.current.textContent = isCorrect
      ? `CORRECT NOTE: ${note.fullName}`
      : `WRONG NOTE: ${note.fullName}`
    resultRef.current.style.color = isCorrect ? "green" : "red"
  }, [])

  const handleAttack = useCallback(
    async (note: PianoNote, strict = false) => {
      const isCorrect = noteRef.current.isEqual(note, strict)

      updateResult(isCorrect, noteRef.current)

      if (!isCorrect) {
        sheetRef.current?.addNote(note)
        await sheetRef.current?.highlightNote(note)
      } else {
        await sheetRef.current?.highlightNote(noteRef.current)
      }

      if (isCorrect) {
        setTracking((prev) => ({
          ...prev,
          correct: prev.correct + 1,
          total: prev.total + 1,
        }))
      } else {
        setTracking((prev) => ({
          ...prev,
          total: prev.total + 1,
        }))
      }

      updateNote()
    },
    [updateNote, updateResult],
  )

  const { enabled, connect, midi, error } = useMidi({
    onNoteOn: (note) => handleAttack(note, true),
  })

  return (
    <Fragment>
      <p>
        {" "}
        Correct: {tracking.correct} / {tracking.total}{" "}
      </p>
      <div id="sheet-root" ref={elRef} className={className}></div>
      <Piano onAttack={handleAttack} />

      <p ref={resultRef}></p>

      <Button onClick={connect}>Use Midi ({enabled ? "Yes" : "No"})</Button>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {midi.inputs.map((input) => (
          <li key={input.id}>{input.name}</li>
        ))}
      </ul>
    </Fragment>
  )
}

export default Sheet
