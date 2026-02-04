export class LeagueMember {
  userId: string;
  userName: string;
  joinedAt: Date;

  constructor(partial: Partial<LeagueMember>) {
    Object.assign(this, partial);
  }
}
