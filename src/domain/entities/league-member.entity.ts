export class LeagueMember {
  userId: string;
  joinedAt: Date;
  isAdmin: boolean;

  constructor(partial: Partial<LeagueMember>) {
    Object.assign(this, partial);
  }
}
