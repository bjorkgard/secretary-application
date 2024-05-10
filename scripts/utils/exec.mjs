import { execSync } from 'node:child_process'
import { resolve }  from 'node:path'

function makeOptions(options) {
  return {
    stdio:    options?.inherit ? 'inherit' : 'pipe',
    cwd:      resolve(),
    encoding: 'utf8',
  }
}

export default function exec(commands, options) {
  const outputs = []

  for (const command of commands) {
    const output = execSync(command, makeOptions(options))
    outputs.push(output)
  }

  return outputs
}
