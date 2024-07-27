import { Entry } from "../../shared/suspectDatabase/entry"

export interface TextContent {
  style?:
    ('bold' |
    'italic' |
    'underline' |
    'strikethrough')[]
  entry: Entry
  content: TextContent[]
}