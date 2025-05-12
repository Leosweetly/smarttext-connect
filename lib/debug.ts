/**
 * Debug utilities for logging, error handling, and performance measurement.
 * 
 * These utilities help with debugging and monitoring the application.
 * They can be enabled in production by setting the NEXT_PUBLIC_DEBUG environment variable to 'true'.
 */

// Check if debug mode is enabled
const isDebugEnabled = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_DEBUG === 'true'
  } else {
    // Server-side
    return process.env.NEXT_PUBLIC_DEBUG === 'true'
  }
}

/**
 * Log a debug message to the console.
 * Only logs if debug mode is enabled.
 */
export const debug = (message: string, data: Record<string, any> = {}, error?: Error) => {
  if (!isDebugEnabled()) return
  
  console.debug(`[DEBUG] ${message}`, data, error ? error : '')
}

/**
 * Log an info message to the console.
 * Only logs if debug mode is enabled.
 */
export const info = (message: string, data: Record<string, any> = {}) => {
  if (!isDebugEnabled()) return
  
  console.info(`[INFO] ${message}`, data)
}

/**
 * Log a warning message to the console.
 * Only logs if debug mode is enabled.
 */
export const warning = (message: string, data: Record<string, any> = {}) => {
  if (!isDebugEnabled()) return
  
  console.warn(`[WARNING] ${message}`, data)
}

/**
 * Log an error message to the console.
 * Always logs, regardless of debug mode.
 */
export const error = (message: string, data: Record<string, any> = {}, error?: Error) => {
  console.error(`[ERROR] ${message}`, data, error ? error : '')
  
  // In a real application, you might want to send this to an error tracking service
  // like Sentry or LogRocket
}

/**
 * Measure the performance of a function.
 * Only logs if debug mode is enabled.
 */
export const measurePerformance = <T>(fn: () => T, name: string): T => {
  if (!isDebugEnabled()) return fn()
  
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  console.debug(`[PERFORMANCE] ${name} took ${end - start}ms`)
  
  return result
}

/**
 * Measure the performance of an async function.
 * Only logs if debug mode is enabled.
 */
export const measureAsyncPerformance = async <T>(fn: () => Promise<T>, name: string): Promise<T> => {
  if (!isDebugEnabled()) return fn()
  
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  
  console.debug(`[PERFORMANCE] ${name} took ${end - start}ms`)
  
  return result
}
