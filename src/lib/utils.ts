import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// biome-ignore lint/suspicious/noEmptyBlockStatements: Noop function
export const noop = () => {}
