import { DefineComponent } from "vue";
import { File } from "../files/file";

export interface EMailAccount {
  personId: string,
  displayName: string,
  password: string,
  avatarUrl?: string
}

export interface EMail {
  id: string,
  sender: string,
  reciever: string[],
  subject: string,
  content: DefineComponent | string,
  attachments?: File[]
}