import { JsonMap } from "../../shared/json";

export class Team {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public active: boolean = true,
    public meta: JsonMap = {},
  ) {}
}