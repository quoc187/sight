import { useRef } from "react"

/**
 * A hook that returns a ref that is updated with the latest value
 *
 * @param value The value to store in the ref
 * @returns The ref
 */
export const useValueRef = <T>(value: T) => {
  const ref = useRef(value)

  ref.current = value

  return ref
}
