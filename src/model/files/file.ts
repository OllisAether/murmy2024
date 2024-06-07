import { Asset } from "../asset";

export interface File {
  asset: Asset
  name: string
  type: 'folder' | 'image' | 'pdf' | 'video' | 'rich-text'
  children?: File[]
}