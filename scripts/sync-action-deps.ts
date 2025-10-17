import fs from 'fs'
import { exit } from 'process'

/**
 * Syncs dependencies from package.json to action.yml
 * This ensures that the action.yml stays in sync with the actual dependencies
 */
async function syncDeps() {
  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const dependencies = packageJson.dependencies

    if (!dependencies) {
      throw new Error('No dependencies found in package.json')
    }

    // Read action.yml
    const actionYml = fs.readFileSync('action.yml', 'utf8')

    // Build the new dependencies JSON string with proper indentation
    const depsJson = JSON.stringify(dependencies, null, 12)

    // Replace the dependencies section in action.yml
    // This regex matches the entire dependencies JSON block
    const depsRegex = /"dependencies": \{[\s\S]*?\n {8}\}/

    const replacement = `"dependencies": ${depsJson.split('\n').join('\n          ')}`

    const updatedYaml = actionYml.replace(depsRegex, replacement)

    // Write back to action.yml
    fs.writeFileSync('action.yml', updatedYaml)

    console.log(
      '✅ Successfully synced dependencies from package.json to action.yml'
    )
    console.log('Updated dependencies:', Object.keys(dependencies).join(', '))
  } catch (error) {
    console.error(
      '✗ Failed to sync dependencies:',
      error instanceof Error ? error.message : String(error)
    )
    exit(1)
  }
}

syncDeps()
