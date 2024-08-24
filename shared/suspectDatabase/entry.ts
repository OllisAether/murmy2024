import { TextContent } from "../textContent"

export interface Entry {
  id: string
  suspectId: string,

  title: TextContent | string,
  description?: TextContent | string,
  imageAssetId?: string,
}