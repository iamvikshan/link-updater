import { githubApi } from './utils.ts'
import * as readline from 'readline'

const owner = 'iamvikshan'
const repo = 'link-updater'
const tag = 'v1.1.4'

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question(`${message} (y/N): `, answer => {
      rl.close()
      resolve(answer.toLowerCase() === 'y')
    })
  })
}

async function deleteSpecific() {
  try {
    // GitHub Release Check & Delete
    const { data: releases } = await githubApi.get(
      `/repos/${owner}/${repo}/releases`
    )
    const release = releases.find(
      (r: { tag_name: string; id: number }) => r.tag_name === tag
    )

    if (release) {
      const confirmed = await confirm(`Delete GitHub release ${tag}?`)
      if (confirmed) {
        try {
          await githubApi.delete(
            `/repos/${owner}/${repo}/releases/${release.id}`
          )
          console.log(`✅ [GitHub] Deleted release: ${tag}`)
        } catch (error) {
          const err = error as {
            response?: { status: number }
            message: string
          }
          if (err.response?.status === 404) {
            console.log(`ℹ️ [GitHub] Release ${tag} already deleted`)
          } else {
            console.error(
              `❌ [GitHub] Failed to delete release: ${err.message}`
            )
          }
        }
      }
    } else {
      console.log(`ℹ️ [GitHub] Release ${tag} not found`)
    }

    // GitHub Tag Check & Delete
    const tagConfirmed = await confirm(`Delete GitHub tag ${tag}?`)
    if (tagConfirmed) {
      try {
        await githubApi.delete(`/repos/${owner}/${repo}/git/refs/tags/${tag}`)
        console.log(`✅ [GitHub] Deleted tag: ${tag}`)
      } catch (error) {
        const err = error as { response?: { status: number }; message: string }
        if (err.response?.status === 422 || err.response?.status === 404) {
          console.log(`ℹ️ [GitHub] Tag ${tag} already deleted or doesn't exist`)
        } else {
          console.error(`❌ [GitHub] Failed to delete tag: ${err.message}`)
        }
      }
    }

    // NPM Package Delete - Independent of GitHub operations
    // Note: Unpublishing npm versions can have significant consequences.
    // Please read the npm documentation on unpublishing before uncommenting the code below.
    // https://docs.npmjs.com/policies/unpublish

    /*
    const npmConfirmed = await confirm(
      `Delete npm package version ${npmVersion}?`
    )
    if (npmConfirmed) {
      const npmDeleted = await unpublishNpmVersion(npmVersion)
      if (npmDeleted) {
        console.log(`[NPM] Deleted package version: ${npmVersion}`)
      }
    }
    */
  } catch (error) {
    console.error(
      '❌ [Error] Failed to fetch repository data:',
      error instanceof Error ? error.message : String(error)
    )
  }
}

deleteSpecific().catch(console.error)
