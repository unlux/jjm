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

  let remainingText = description || ""

  // Initialize parts to `false`. They will only get a value if their marker is found.
  let howToPlayPart: string | false = false
  let coolThingsPart: string[] | false = false

  // 1. Find and slice off the "How to Play" section.
  const playSplit = remainingText.split(MARK_PLAY, 2)
  if (playSplit.length === 2) {
    remainingText = playSplit[0]
    // Assign the string content if the marker was found
    howToPlayPart = playSplit[1].trim()
  }

  // 2. From the remainder, find and slice off the "Cool Things" section.
  const coolSplit = remainingText.split(MARK_COOL, 2)
  if (coolSplit.length === 2) {
    remainingText = coolSplit[0]
    // Assign the tokenized list if the marker was found
    coolThingsPart = toTokens(coolSplit[1])
  }

  // 3. Whatever is left is the main description.
  const descriptionPart = remainingText.trim()

  return {
    description: descriptionPart,
    coolThings: coolThingsPart,
    howToPlay: howToPlayPart,
  }
}
