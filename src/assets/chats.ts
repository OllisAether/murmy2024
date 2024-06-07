import { Chat } from '@/model/chat/chat'
import { ChatAccount } from '@/model/chat/contact'

export const accounts: ChatAccount[] = [
  {
    personId: 'alice.doe',
    password: 'alice2023',
    displayname: 'Alice',
    bio: 'Hello, I am Alice!',
    hasEmailLinked: true,
    hasBirthday: true,
  }
]

export const chats: Chat[] = [
  {
    participants: ['alice.doe', 'bob'],
    messages: [
      {
        sender: 'alice.doe',
        content: 'Hi Bob!',
        date: [4, 1],
        time: [14, 30],
      },
      {
        sender: 'bob',
        content: 'Hi Alice!',
        date: [4, 1],
        time: [14, 31],
      },
      {
        sender: 'alice.doe',
        content: 'How are you?',
        date: [4, 1],
        time: [14, 32],
      },
      {
        sender: 'bob',
        content: 'I am fine, thank you!',
        date: [4, 1],
        time: [14, 33],
      },
    ]
  },
  {
    participants: ['alice.doe', 'charlie'],
    messages: [
      {
        sender: 'alice.doe',
        content: 'Hi Charlie!',
        date: [4, 1],
        time: [14, 30],
      },
      {
        sender: 'charlie',
        content: 'Hi Alice!',
        date: [4, 1],
        time: [14, 31],
      },
      {
        sender: 'alice.doe',
        content: 'How are you?',
        date: [4, 1],
        time: [14, 32],
      },
      {
        sender: 'charlie',
        content: 'I am fine, thank you!',
        date: [4, 1],
        time: [14, 33],
      },
    ]
  }
]