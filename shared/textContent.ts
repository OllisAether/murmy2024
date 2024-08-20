import { Entry } from "./suspectDatabase/entry"

export type TextStyle =
  'p' |
  'bold' |
  'italic' |
  'underline' |
  'strikethrough' |
  'wiggly' |
  'shaky' |
  'superscript' |
  'subscript'

export interface TextContent {
  style?: TextStyle[],
  css?: {
    [key: string]: string
  },
  entry?: Entry
  content: (string | TextContent)[]
}

export function textContent(content: (TextContent | string)[]): TextContent {
  return {
    content
  }
}

export function entry(entry: Entry | undefined | null, content: TextContent | string): TextContent | string {
  if (!entry) {
    return content
  }

  if (typeof content === 'string') {
    return {
      entry,
      content: [content]
    }
  }

  return {
    ...content,
    entry,
  }
}

export function color(color: string | undefined | null, text: TextContent | string): TextContent | string {
  if (!color) {
    return text
  }

  if (typeof text === 'string') {
    return {
      css: {
        color
      },
      content: [text]
    }
  }

  return {
    ...text,
    css: {
      ...text.css,
      color
    }
  }
}

export function p(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['p'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'p'
    ]
  }
}
export function bold(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['bold'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'bold'
    ]
  }
}
export function italic(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['italic'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'italic'
    ]
  }
}
export function underline(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['underline'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'underline'
    ]
  }
}
export function strikethrough(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['strikethrough'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'strikethrough'
    ]
  }
}
export function wiggly(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['wiggly'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'wiggly'
    ]
  }
}
export function shaky(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['shaky'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'shaky'
    ]
  }
}
export function superscript(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['superscript'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'superscript'
    ]
  }
}
export function subscript(text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      style: ['subscript'],
      content: [text]
    }
  }

  return {
    ...text,
    style: [
      ...(text.style || []),
      'subscript'
    ]
  }
}
export function css(css: { [key: string]: string }, text: TextContent | string): TextContent | string {
  if (typeof text === 'string') {
    return {
      css,
      content: [text]
    }
  }

  return {
    ...text,
    css: {
      ...css,
      ...text.css,
    }
  }
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

  if (text.entry) {
    return [text.entry, ...text.content.flatMap(getEntries)]
  }

  return [...text.content.flatMap(getEntries)]
}