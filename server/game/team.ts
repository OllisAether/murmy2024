export class Team {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public meta: {
      tableNumber?: number
    } = {}
  ) {}
}