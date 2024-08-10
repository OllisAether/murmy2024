import { TextContent } from "@/model/textContent"
import moment, { Moment } from "moment"
import { Entry } from "../../../suspectDatabase/entry"
import { ImageEntry } from "../../../clue"
import { idGen } from "../../../random"

export type Chat = GroupChat | PrivateChat

export interface ChatBase {
  type: 'private' | 'group'
  messages: (ChatMessage | ChatTimestamp | ChatImage)[]
}

export interface GroupChat extends ChatBase {
  type: 'group'
  name: string
  iconAssetId?: string
  participants: string[]
}

export interface PrivateChat extends ChatBase {
  type: 'private'
  number: string
}

export interface ChatMessage {
  type: 'message'
  sender: string | 'me'
  content: TextContent | string
}

export interface ChatImage {
  type: 'image'
  sender: string | 'me'
  imageAssetId: string
  entries?: ImageEntry[]
}

export interface ChatTimestamp {
  type: 'timestamp'
  timestamp: Moment
}

export const chats: (PrivateChat | GroupChat)[] = [
  {
    type: 'private',
    number: '+1234567890',
    messages: [
      {
        type: 'timestamp',
        timestamp: moment('2023-08-10T09:00:00Z'),
      },
      {
        type: 'message',
        sender: '+1234567890',
        content: 'Hey John, are you coming to the meeting?',
      },
      {
        type: 'message',
        sender: 'me',
        content: 'Yes, I’ll be there in 10 minutes.',
      },
    ],
  },
  {
    type: 'private',
    number: '+0987654321',
    messages: [
      {
        type: 'timestamp',
        timestamp: moment('2023-08-10T11:00:00Z'),
      },
      {
        type: 'message',
        sender: '+0987654321',
        content: 'Hi, Jane! Can you review the document I sent?',
      },
      {
        type: 'message',
        sender: 'me',
        content: 'Sure, I’ll look at it now.',
      },
    ],
  },
  {
    type: 'group',
    name: 'Project Team',
    iconAssetId: 'dokumente/Versuchsprotokoll.png',
    participants: ['+1234567890', '+1122334455', '+1222333444', '+1555666777'],
    messages: [
      {
        type: 'timestamp',
        timestamp: moment('2023-08-03T08:00:00Z'),
      },
      {
        type: 'message',
        sender: 'me',
        content: 'Good morning team! Please update your progress.',
      },
      {
        type: 'message',
        sender: '+1122334455',
        content: 'I’ve finished the initial draft of the proposal.',
      },
      {
        type: 'timestamp',
        timestamp: moment('2023-08-11T08:00:00Z'),
      },
      {
        type: 'message',
        sender: '+1234567890',
        content: 'I’ll start working on the financials.',
      },
    ],
  },
  {
    type: 'group',
    name: 'Friends Group',
    participants: ['+1222333444', '+1555666777'],
    messages: [
      {
        type: 'timestamp',
        timestamp: moment('2023-08-02T14:00:00Z'),
      },
      {
        type: 'message',
        sender: '+1555666777',
        content: 'Anyone up for a movie tonight?',
      },
      {
        type: 'message',
        sender: 'me',
        content: 'I’m in!',
      },
      {
        type: 'message',
        sender: 'me',
        content: 'I’m in!!!!!',
      },
      {
        type: 'timestamp',
        timestamp: moment('2023-08-12T14:00:00Z'),
      },
      {
        type: 'message',
        sender: '+1222333444',
        content: 'Count me in too!',
      },
      {
        type: 'image',
        sender: '+1222333444',
        imageAssetId: 'dokumente/autopsiebericht.png',
        entries: [
          {
            rect: { x: 0.4, y: 0.1, width: 0.6, height: 0.5 },
            entry: {
              matterId: 'autopsiebericht' + idGen(),
              suspectId: 'general',
              title: 'Autopsiebericht',
            }
          }
        ],
      },
    ],
  },
];