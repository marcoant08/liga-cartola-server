import { League } from '../../entities/league.entity';
import { LeagueMember } from '../../entities/league-member.entity';
import { Round } from '../../entities/round.entity';

export const LEAGUE_REPOSITORY = 'LEAGUE_REPOSITORY';

export interface ILeagueRepository {
  create(league: League): Promise<League>;
  findById(id: string): Promise<League | null>;
  findByInviteToken(token: string): Promise<League | null>;
  findByIds(leagueIds: string[]): Promise<League[]>;
  update(id: string, data: Partial<League>): Promise<League>;
  addMember(leagueId: string, member: LeagueMember): Promise<void>;
  addRound(leagueId: string, round: Round): Promise<void>;
  checkMemberExists(leagueId: string, userId: string): Promise<boolean>;
}
