import { Entry } from "./suspectDatabase/entry"

export interface TextContent {
  style?:
    ('bold' |
    'italic' |
    'underline' |
    'strikethrough')[]
  entry: Entry
  content: (string | TextContent)[]
}

export function getRawText (text: TextContent | string): string {
  if (typeof text === 'string') {
    return text
  }

  return text.content.map(getRawText).join('')
}

export function getEntries (text: TextContent | string): Entry[] {
  if (typeof text === 'string') {
    return []
  }

  return [text.entry, ...text.content.flatMap(getEntries)]
}