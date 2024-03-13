import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names with tailwindcss classes
 * @param inputs
 * @returns Merged class names
 */
export function cm(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
