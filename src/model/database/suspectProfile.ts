export interface SuspectEntry {
  id: string
  name?: string
  value: string
}

export type ProfileEntryType = 'basic' | 'accounts' | 'pictures' | 'hobbies'

export interface SuspectProfile {
  personId: string,

  basic: SuspectEntry[],

  accounts: SuspectEntry[],

  pictures: SuspectEntry[],

  hobbies: SuspectEntry[],
}