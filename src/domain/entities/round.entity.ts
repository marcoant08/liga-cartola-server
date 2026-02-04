export class Round {
  roundNumber: number;
  winnerId: string;
  winnerName: string;
  registeredAt: Date;
  registeredBy: string;

  constructor(partial: Partial<Round>) {
    Object.assign(this, partial);
  }
}
