import { Media } from "@/model/media"

export const media: Media[] = [
  {
    name: 'test',
    displayName: 'Test',
    asset: {
      type: 'video',
      name: 'testmedia',
      url: 'test.mp4'
    }
  },
  {
    name: 'test2',
    displayName: 'Test 2',
    asset: {
      type: 'video',
      name: 'testmedia',
      url: 'test.mp4'
    }
  }
]

export const mediaMap = media.reduce((map, m) => {
  map[m.name] = m
  return map
} , {} as Record<string, Media>)