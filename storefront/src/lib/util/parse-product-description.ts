/**
 * Splits a string into a list of non-empty tokens.
 * Now handles hyphens as bullet points.
 * @param raw The raw string to tokenize.
 * @returns An array of strings.
 */
const toTokens = (raw: string): string[] =>
  raw
    // Added '-' to handle hyphens as list items
    .split(/\n|\r|•|,|;|-|\u2022/g)
    .map((t) => t.trim())
    .filter(Boolean)

/**
 * Parses a product description into three distinct parts.
 * If a section marker isn't found, its value will be `false`.
 * @param description The full product description string.
 * @returns An object with the structured content.
 */
export const parseProductDescription = (description: string) => {
  const MARK_COOL = /\n?\s*Cool things mastered with this:/i
  const MARK_PLAY = /\n?\s*How to Play:/i

  // Find both markers with their index
  const coolMatch = MARK_COOL.exec(description)
  const playMatch = MARK_PLAY.exec(description)

  let descriptionPart = description
  let howToPlayPart: string | false = false
  let coolThingsPart: string[] | false = false

  // Figure out which marker comes first
  const positions = [
    coolMatch ? { type: "cool", index: coolMatch.index } : null,
    playMatch ? { type: "play", index: playMatch.index } : null,
  ].filter(Boolean) as { type: "cool" | "play"; index: number }[]

  // Sort by position in the string
  positions.sort((a, b) => a.index - b.index)

  if (positions.length > 0) {
    // Description is always before the first marker
    descriptionPart = description.slice(0, positions[0].index).trim()

    // For each marker, slice content until the next marker (or end of string)
    positions.forEach((pos, i) => {
      const start = pos.index
      const end = positions[i + 1]?.index ?? description.length
      const rawSection = description.slice(start, end)

      if (pos.type === "cool") {
        const content = rawSection.replace(MARK_COOL, "").trim()
        coolThingsPart = toTokens(content)
      } else if (pos.type === "play") {
        const content = rawSection.replace(MARK_PLAY, "").trim()
        howToPlayPart = content
      }
    })
  } else {
    // No markers at all → everything is description
    descriptionPart = description.trim()
  }

  return {
    description: descriptionPart,
    coolThings: coolThingsPart,
    howToPlay: howToPlayPart,
  }
}
