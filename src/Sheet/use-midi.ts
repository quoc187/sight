import { useCallback, useEffect, useRef, useState } from "react"
import { Midi } from "@/core/midi"
import { PianoNote } from "@/core/piano/base"
import { useValueRef } from "@/hooks/use-value-ref"

type Props = {
  onNoteOn?: (note: PianoNote) => void
}

export const useMidi = ({ onNoteOn }: Props) => {
  const [midi] = useState(() => new Midi())
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState("")

  const noteOnListener = useValueRef(onNoteOn)
  const noteOnSubscription = useRef<() => void>(null)

  const connect = useCallback(() => {
    setError("")
    setEnabled(false)

    if (noteOnListener.current) {
      noteOnSubscription.current?.()
      noteOnSubscription.current = null
    }

    midi
      .init()
      .then((m) => {
        setEnabled(true)
        noteOnSubscription.current = midi.onNoteOn((event) => {
          noteOnListener.current?.(
            PianoNote.fromNameAndOctave(event.note.name, event.note.octave),
          )
        })

        return m
      })
      .catch((error) => {
        if (error.message.includes("navigator")) {
          setError(
            "This browser does not support MIDI. Please use a different browser.",
          )

          return
        }

        setError(error.message)
      })
  }, [midi, noteOnListener])

  useEffect(() => {
    const subscription = noteOnSubscription.current

    return () => {
      subscription?.()
    }
  }, [])

  return {
    enabled,
    error,
    connect,
    midi,
  }
}
