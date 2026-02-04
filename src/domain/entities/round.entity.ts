export class Round {
  roundNumber: number;
  winnerId: string;
  winnerName: string;
  registeredAt: Date;

  constructor(partial: Partial<Round>) {
    Object.assign(this, partial);
  }
}
