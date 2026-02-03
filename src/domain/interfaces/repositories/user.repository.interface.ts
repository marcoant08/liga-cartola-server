import { User } from '../../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY' as const;

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  verifyEmail(id: string): Promise<void>;
  addLeague(userId: string, leagueId: string): Promise<void>;
  removeLeague(userId: string, leagueId: string): Promise<void>;
}
