import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class RemoveLeagueMemberUseCase {
  constructor(
    @Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository,
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(leagueId: string, memberId: string): Promise<LeagueResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    if (memberId === league.adminId) {
      throw new BadRequestException('Não é possível remover o administrador da liga');
    }

    const member = league.members.find((m) => m.userId === memberId);
    if (!member) {
      throw new NotFoundException('Membro não encontrado nesta liga');
    }

    await this.leagueRepository.removeMember(leagueId, memberId);

    if (!member.isGuest) {
      await this.userRepository.removeLeague(memberId, leagueId);
    }

    const updatedLeague = await this.leagueRepository.findById(leagueId);
    if (!updatedLeague) {
      throw new NotFoundException('Liga não encontrada');
    }

    return this.toResponseDto(updatedLeague);
  }

  private toResponseDto(league: any): LeagueResponseDto {
    return {
      id: league.id,
      name: league.name,
      description: league.description,
      adminId: league.adminId,
      roundValue: league.roundValue,
      maxParticipants: league.maxParticipants,
      isPublic: league.isPublic ?? false,
      inviteToken: league.inviteToken,
      inviteTokenExpiresAt: league.inviteTokenExpiresAt,
      members: league.members.map((m: any) => ({
        userId: m.userId,
        userName: m.userName,
        joinedAt: m.joinedAt,
        isGuest: !!m.isGuest,
        pixKey: m.pixKey ?? '',
        teamName: m.teamName ?? '',
      })),
      rounds: league.rounds.map((r: any) => ({
        roundNumber: r.roundNumber,
        winnerId: r.winnerId,
        winnerName: r.winnerName,
        registeredAt: r.registeredAt,
      })),
      createdAt: league.createdAt,
      updatedAt: league.updatedAt,
    };
  }
}
