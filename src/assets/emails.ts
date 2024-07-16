import { EMail, EMailAccount } from "@/model/email/email";
import { useGameManager } from "@/store/gameManager";
import { defineComponent, h } from "vue";

export const emailAccounts: EMailAccount[] = [
  {
    personId: 'alice.doe',
    displayName: 'Alice Doe',
    password: 'password'
  },
  {
    personId: 'bob.simple',
    displayName: 'Bob Simple',
    password: 'password'
  }
]

export const emails: EMail[] = [
  {
    id: 'alicebob',
    sender: 'alice.doe',
    reciever: ['bob.simple'],
    subject: 'Hi Bob!',
    content: defineComponent({
      setup() {
        return () => [
          h('p', 'Hi Bob!'),
          h('p', 'How are you?'),
          h('p', 'Regards, Alice'),
          h('img', { src: useGameManager().getAsset('testimage')?.content })
        ]
      },
    }),
    attachments: [
      {
        asset: {
          type: 'image',
          name: 'testimage',
          url: '/test.png'
        },
        name: 'test.png',
        type: 'image'
      }
    ]
  },
  {
    id: 'alicebob',
    sender: 'bob.simple',
    reciever: ['alice.doe'],
    subject: 'Hi Alice!',
    content: defineComponent({
      setup() {
        return () => [
          h('p', 'Hi Alice!'),
          h('p', 'How are you?'),
          h('p', 'Regards, Bob'),
          h('img', { src: useGameManager().getAsset('testimage')?.content })
        ]
      },
    }),
    attachments: [
      {
        asset: {
          type: 'image',
          name: 'testimage',
          url: '/test.png'
        },
        name: 'test.png',
        type: 'image'
      }
    ]
  }
]