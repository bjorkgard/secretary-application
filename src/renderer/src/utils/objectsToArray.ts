export default function objectsToArray(object: Record<string, unknown>): string[] {
  let result: string[] = []

  Object.values(object).forEach((value) => {
    if (typeof value === 'string') {
      result = [...result, value]
    }
    else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      result = [...result, ...objectsToArray(value as Record<string, unknown>)]
    }
  })

  return result
}
