import { Fragment, useCallback, useEffect, useRef } from "react"
import { Piano } from "@/components/piano"
import { PianoNote } from "@/core/piano/base"
import { getOctave, getRandomNoteName } from "@/core/piano/utils"
import { VexFlowPianoSheet } from "@/core/sheet"

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

const Sheet = ({ className }: Props) => {
  const sheetRef = useRef<VexFlowPianoSheet | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const noteRef = useRef<PianoNote>(randomNote())
  const resultRef = useRef<HTMLParagraphElement | null>(null)

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

  const handleAttack = useCallback(
    (note: PianoNote) => {
      const isCorrect = noteRef.current.isEqual(note)

      if (!resultRef.current) {
        return updateNote()
      }

      if (isCorrect) {
        resultRef.current.textContent = `CORRECT NOTE: ${noteRef.current.fullName}`
        resultRef.current.style.color = "green"
      } else {
        resultRef.current.textContent = `WRONG NOTE: ${noteRef.current.fullName}`
        resultRef.current.style.color = "red"
      }

      updateNote()
    },
    [updateNote],
  )

  return (
    <Fragment>
      <div id="sheet-root" ref={elRef} className={className}></div>
      <Piano onAttack={handleAttack} />

      <p ref={resultRef}></p>
    </Fragment>
  )
}

export default Sheet
