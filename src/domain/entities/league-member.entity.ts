export class LeagueMember {
  userId: string;
  userName: string;
  joinedAt: Date;
  isGuest: boolean;
  pixKey: string;
  teamName: string;

  constructor(partial: Partial<LeagueMember>) {
    Object.assign(this, partial);
  }
}
