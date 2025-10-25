import { useMemo } from "react"

type RefType<T> =
  | React.RefObject<T>
  | ((instance: T | null) => void)
  | null
  | undefined

export function useMergeRef<T>(...refs: RefType<T>[]): React.RefObject<T> {
  return useMemo(() => {
    let current: T | null = null

    return {
      get current(): T | null {
        return current
      },
      set current(value: T | null) {
        current = value
        refs.forEach((ref) => {
          if (ref) {
            if (typeof ref === "function") {
              ref(value)
            } else {
              ;(ref as React.RefObject<T | null>).current = value
            }
          }
        })
      },
    } as React.RefObject<T>
  }, [refs])
}
