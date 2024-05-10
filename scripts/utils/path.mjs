import { get }                from 'node:http'
import { dirname, normalize } from 'node:path'

function getDevFolder(path) {
  const [nodeModules, devFolder] = normalize(dirname(path)).split(/\/|\\/g)

  return [nodeModules, devFolder].join('/')
}

export default getDevFolder
