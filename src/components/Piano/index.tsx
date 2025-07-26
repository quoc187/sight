import { getNotesInOctave, PianoNote } from "@/lib/piano/base"
import { computeAndZipNotesPosition } from "@/lib/piano/renderer"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import "./styles.scss"

export const Piano = () => {
  const [notes] = useState<PianoNote[]>(() => getNotesInOctave(4))

  const notesWithConfig = useMemo(() => {
    return computeAndZipNotesPosition(notes, {
      whiteKeyWidth: 40,
      whiteKeyHeight: 160,
      whiteKeyGap: 0,
      blackKeyWidth: 20,
      blackKeyHeight: 100,
    })
  }, [notes])

  const minX = useMemo(() => {
    return Math.min(...notesWithConfig.map(({ config }) => config.x))
  }, [notesWithConfig])

  const maxX = useMemo(() => {
    return Math.max(
      ...notesWithConfig.map(({ config }) => config.x + config.width),
    )
  }, [notesWithConfig])

  const width = useMemo(() => {
    return maxX - minX
  }, [minX, maxX])

  return (
    <div className="relative w-full" style={{ height: 160, width }}>
      {notesWithConfig.map(({ note, config }) => (
        <button
          data-note={note.fullName}
          data-midi-number={note.midiNumber}
          key={note.midiNumber}
          style={{
            left: config.x - minX,
            width: config.width,
            height: config.height,
            zIndex: config.zIndex,
          }}
          className={cn(
            "piano-key",
            note.isBlackKey ? "black-key" : "white-key",
          )}
        ></button>
      ))}
    </div>
  )
}
