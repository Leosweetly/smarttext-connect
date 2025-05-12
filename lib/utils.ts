import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly.
 * This is useful for conditionally applying classes.
 * 
 * @example
 * // Returns "bg-red-500 p-4 hover:bg-red-700"
 * cn("bg-red-500", "p-4", "hover:bg-red-700")
 * 
 * @example
 * // Returns "bg-blue-500 p-4" if isActive is true, otherwise "bg-gray-500 p-4"
 * cn("p-4", isActive ? "bg-blue-500" : "bg-gray-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format.
 * 
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormatOptions to customize the format
 * @returns A formatted date string
 * 
 * @example
 * // Returns "Jan 1, 2023"
 * formatDate("2023-01-01T00:00:00.000Z")
 * 
 * @example
 * // Returns "January 1, 2023, 12:00 AM"
 * formatDate("2023-01-01T00:00:00.000Z", { 
 *   dateStyle: "long", 
 *   timeStyle: "short" 
 * })
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Truncates a string to a specified length and adds an ellipsis if truncated.
 * 
 * @param str - The string to truncate
 * @param length - The maximum length of the string
 * @returns The truncated string
 * 
 * @example
 * // Returns "Hello..."
 * truncateString("Hello world", 5)
 * 
 * @example
 * // Returns "Hello world"
 * truncateString("Hello world", 20)
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param str - The string to capitalize
 * @returns The capitalized string
 * 
 * @example
 * // Returns "Hello"
 * capitalizeFirstLetter("hello")
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Delays execution for a specified number of milliseconds.
 * 
 * @param ms - The number of milliseconds to delay
 * @returns A promise that resolves after the specified delay
 * 
 * @example
 * // Waits for 1 second
 * await sleep(1000)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generates a random string of a specified length.
 * 
 * @param length - The length of the random string
 * @returns A random string
 * 
 * @example
 * // Returns a random string of length 10
 * randomString(10)
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
