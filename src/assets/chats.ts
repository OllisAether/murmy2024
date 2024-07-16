import { Chat } from '@/model/chat/chat'
import { ChatAccount } from '@/model/chat/contact'

export const chatAccounts: ChatAccount[] = [
  {
    personId: 'alice.doe',
    password: 'alice2023',
    displayname: 'Alice',
    bio: 'Hello, I am Alice!',
    hasEmailLinked: true,
    hasBirthday: true,
  },
  {
    personId: 'bob.simple',
    password: 'bob2023',
    displayname: 'Bob',
    bio: 'Hello, I am Bob!',
    hasEmailLinked: true,
    hasBirthday: true,
  },
  {
    personId: 'charlie.doe',
    password: 'charlie2023',
    displayname: 'Charlie',
    bio: 'Hello, I am Charlie!',
    hasEmailLinked: true,
    hasBirthday: true,
  }
]

export const nameOverride: {
  [person: string]: {
    [personToOverride: string]: string
  }
} = {
  'alice.doe': {
    'bob.simple': 'Bobby <3',
  },
}

export const chats: Chat[] = [
  {
    id: 'alicebob',
    participants: ['alice.doe', 'bob.simple'],
    messages: [
      {
        sender: 'alice.doe',
        content: 'Hi Bob!',
        date: [4, 1],
        time: [14, 30],
      },
      {
        sender: 'bob.simple',
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
        sender: 'bob.simple',
        content: 'I am fine, thank you!',
        date: [4, 1],
        time: [14, 33],
      },
    ]
  },
  {
    id: 'alicecharlie',
    participants: ['alice.doe', 'charlie.doe'],
    messages: [
      {
        sender: 'alice.doe',
        content: 'Hi Charlie!',
        date: [4, 1],
        time: [14, 30],
      },
      {
        sender: 'charlie.doe',
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
        sender: 'charlie.doe',
        content: 'I am fine, thank you!',
        date: [4, 1],
        time: [14, 33],
      },
    ]
  }
]