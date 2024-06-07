export interface Chat {
  name?: string,
  participants: string[],
  messages: {
    sender: string,
    content: string[] | string,
    date: [number, number],
    time: [number, number],
  }[],
}