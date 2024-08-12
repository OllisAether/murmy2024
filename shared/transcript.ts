import { TextContent } from "./textContent";

export interface Transcript {
  id: string
  for: string
  title: string
  content: TextContent | string
  thumbnailAssetId: string
}
