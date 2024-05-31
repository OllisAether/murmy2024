
export interface Asset {
  type: 'image' | 'audio' | 'video'
  name: string
  url: string
  content?: any
}