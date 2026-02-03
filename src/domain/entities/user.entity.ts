export class User {
  id: string;
  email: string;
  name: string;
  teamName: string;
  pixKey: string;
  emailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationExpiresAt?: Date;
  password: string;
  leagues: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
