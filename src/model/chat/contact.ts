export interface ChatAccount {
  personId: string,
  password: string,
  displayname: string,
  avatarUrl?: string,
  bio: string,
  hasEmailLinked?: boolean,
  hasBirthday?: boolean,
  hasAddress?: boolean,
}