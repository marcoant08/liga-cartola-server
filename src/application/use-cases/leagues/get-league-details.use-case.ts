import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class GetLeagueDetailsUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, userId: string): Promise<LeagueResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    // Verificar se usuário é membro
    const isMember = await this.leagueRepository.checkMemberExists(leagueId, userId);
    if (!isMember) {
      throw new ForbiddenException('Você não é membro desta liga');
    }

    return this.toResponseDto(league);
  }

  private toResponseDto(league: any): LeagueResponseDto {
    return {
      id: league.id,
      name: league.name,
      description: league.description,
      adminId: league.adminId,
      roundValue: league.roundValue,
      maxParticipants: league.maxParticipants,
      inviteToken: league.inviteToken,
      inviteTokenExpiresAt: league.inviteTokenExpiresAt,
      members: league.members.map((m: any) => ({
        userId: m.userId,
        userName: m.userName,
        joinedAt: m.joinedAt,
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
