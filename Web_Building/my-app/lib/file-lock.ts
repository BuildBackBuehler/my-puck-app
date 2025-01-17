// lib/file-lock.ts
import { open, unlink } from 'fs/promises'

// Add sleep utility directly in this file
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function acquireLock(lockFile: string, maxAttempts = 10): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const handle = await open(lockFile, 'wx')
      await handle.close()
      return lockFile
    } catch (error) {
      if (error.code === 'EEXIST') {
        await sleep(100) // Wait 100ms before trying again
        continue
      }
      throw error
    }
  }
  throw new Error('Could not acquire lock')
}

export async function releaseLock(lockFile: string): Promise<void> {
  try {
    await unlink(lockFile)
  } catch (error) {
    console.error('Error releasing lock:', error)
  }
}