import { useEffect, useRef } from "react"
import { Stave, Renderer, StaveNote, Voice, Formatter } from "vexflow"

const getSizeConfig = () => ({
  width: Math.min(window.innerWidth - 32, 500),
  height: Math.min(window.innerHeight, 200),
  staveWidth: Math.max(window.innerWidth, 500),
  staveSpace: 15,
})

type Props = {
  className?: string
}

const Sheet = ({ className }: Props) => {
  const rendererRef = useRef<Renderer | null>(null)
  const sheetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (rendererRef.current) return
    if (!sheetRef.current) return

    const { width, height, staveWidth, staveSpace } = getSizeConfig()

    Object.assign(sheetRef.current.style, {
      width: `${width}px`,
      height: `${height}px`,
    })

    const renderer = (rendererRef.current = new Renderer(
      sheetRef.current,
      Renderer.Backends.SVG,
    ))
    const context = renderer.getContext()

    renderer.resize(width, height)

    const stave = new Stave(0, 0, staveWidth, {
      spacingBetweenLinesPx: staveSpace,
    })

    stave.addClef("treble")
    stave.setContext(context)

    const note = new StaveNote({ keys: ["c/4"], duration: "w" })

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ numBeats: 1, beatValue: 1 })
    voice.addTickables([note])

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350)

    voice.setContext(context)
    voice.setStave(stave)

    // Render voice
    voice.drawWithStyle()
    stave.drawWithStyle()

    console.log("NOTE", note.getSVGElement())
  }, [])

  return <div id="sheet-root" ref={sheetRef} className={className}></div>
}

export default Sheet
