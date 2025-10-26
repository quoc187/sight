import { useCallback, useMemo, useRef } from "react"
import { useMergeRef } from "@/hooks/use-merge-ref"
import { useValueRef } from "@/hooks/use-value-ref"
import { noop } from "@/lib/utils"

type UsePianoKeyProps = {
  onAttack?: () => void
  onRelease?: () => void
}

const usePianoKey = ({
  onAttack: onAttackFn = noop,
  onRelease: onReleaseFn = noop,
}: UsePianoKeyProps) => {
  const isPressed = useRef(false)
  const {
    current: { onAttack, onRelease },
  } = useValueRef({ onAttack: onAttackFn, onRelease: onReleaseFn })

  const attack = useCallback(() => {
    if (isPressed.current) return

    isPressed.current = true
    onAttack()
  }, [onAttack])

  const release = useCallback(() => {
    if (!isPressed.current) return

    isPressed.current = false
    onRelease()
  }, [onRelease])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      attack()
    },
    [attack],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      release()
    },
    [release],
  )

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      release()
    },
    [release],
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Only release if we don't have pointer capture
      // (if we have capture, onPointerUp will handle it)
      if (
        !e.currentTarget.hasPointerCapture(e.pointerId) &&
        isPressed.current
      ) {
        release()
      }
    },
    [release],
  )

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onPointerLeave: handlePointerLeave,
  }
}

type PianoKeyProps = UsePianoKeyProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.RefObject<HTMLButtonElement>
  }

export const PianoKey = (props: PianoKeyProps) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  const ref = useMergeRef(internalRef, props.ref)

  const assignAttackClass = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.classList.add("attack")
    }
  }, [])

  const assignReleaseClass = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.classList.remove("attack")
    }
  }, [])

  const internalHandlers = useMemo(() => {
    return {
      onAttack: () => {
        assignAttackClass()
        props.onAttack?.()
      },
      onRelease: () => {
        assignReleaseClass()
        props.onRelease?.()
      },
    }
  }, [assignAttackClass, assignReleaseClass, props.onAttack, props.onRelease])

  const handlers = usePianoKey(internalHandlers)

  const mergedHandlers = useMemo(() => {
    return {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        handlers.onPointerDown(e)
        props.onPointerDown?.(e)
      },
      onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
        handlers.onPointerUp(e)
        props.onPointerUp?.(e)
      },
      onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => {
        handlers.onPointerCancel(e)
        props.onPointerCancel?.(e)
      },
      onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
        handlers.onPointerLeave(e)
        props.onPointerLeave?.(e)
      },
    }
  }, [
    handlers,
    props.onPointerDown,
    props.onPointerUp,
    props.onPointerCancel,
    props.onPointerLeave,
  ])

  return <button {...props} {...mergedHandlers} ref={ref} />
}
