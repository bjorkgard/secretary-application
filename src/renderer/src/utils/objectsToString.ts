import objectsToArray from './objectsToArray'

export default function objectsToString(object: Record<string, unknown>) {
  return objectsToArray(object).join(' ')
}
