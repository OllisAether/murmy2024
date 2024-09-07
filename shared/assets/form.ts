import { Form } from "../form";

export const form: Form = [
  
]

export function getFieldFromId (id: string) {
  return form.flatMap(f => f.fields).find(f => f.id === id)
}