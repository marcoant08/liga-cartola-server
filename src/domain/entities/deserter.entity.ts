export class Deserter {
  memberId: string;
  memberName: string;
  desertedAtRound: number;
  registeredAt: Date;

  constructor(partial: Partial<Deserter>) {
    Object.assign(this, partial);
  }
}
