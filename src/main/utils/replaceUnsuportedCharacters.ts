import type { PDFFont } from 'pdf-lib'

/* Checks for each code point whether the given font supports it.
   If not, tries to remove diacritics from said code point.
   If that doesn't work either, replaces the unsupported character with '?'. */
export default function replaceUnsupportedCharacters(string: string, font: PDFFont) {
  const charSet              = font.getCharacterSet()
  const codePoints: number[] = []
  for (const codePointStr of string) {
    const codePoint = codePointStr.codePointAt(0)
    if (codePoint) {
      if (!charSet.includes(codePoint)) {
        const withoutDiacriticsStr = codePointStr.normalize('NFD').replace(/\p{Diacritic}/gu, '')
        const withoutDiacritics    = withoutDiacriticsStr.charCodeAt(0)
        if (charSet.includes(withoutDiacritics)) {
          codePoints.push(withoutDiacritics)
        }
        else {
          codePoints.push('?'.codePointAt(0) ?? 63) // 63 is ASCII code for '?'
        }
      }
      else {
        codePoints.push(codePoint)
      }
    }
  }
  return String.fromCodePoint(...codePoints)
}
