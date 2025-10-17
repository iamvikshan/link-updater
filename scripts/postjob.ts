import fs from 'fs'
import * as core from '@actions/core'
import { exec } from 'child_process'

async function cleanup() {
  try {
    // 1. Restore original project dependencies
    if (fs.existsSync('package.json.original-backup')) {
      fs.copyFileSync('package.json.original-backup', 'package.json')
      fs.unlinkSync('package.json.original-backup')
      console.log('✅ Restored original package.json')
    }

    if (fs.existsSync('bun.lock.original-backup')) {
      fs.copyFileSync('bun.lock.original-backup', 'bun.lock')
      fs.unlinkSync('bun.lock.original-backup')
      console.log('✅ Restored original bun.lock')
    }

    // 2. Clear .env file
    fs.writeFileSync('.env', '')
    console.log('✅ Cleared .env file')

    // 3. Clear Bun cache
    await new Promise(resolve => {
      exec('bun pm cache rm', error => {
        if (error) {
          console.warn('⚠️ Warning: Failed to clear Bun cache:', error)
        } else {
          console.log('✅ Cleared Bun cache')
        }
        resolve(null)
      })
    })

    console.log('✅ Cleanup completed successfully')
  } catch (error) {
    core.setFailed(
      `Cleanup failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

cleanup()
