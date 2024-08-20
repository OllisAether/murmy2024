import { Moment } from "moment";
import { TextContent } from "../textContent";

export interface Note {
  title?: string
  date: Moment
  content: TextContent | string
}