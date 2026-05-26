import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class RemoveDeserterUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, memberId: string): Promise<LeagueResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    const deserter = league.deserters.find((d) => d.memberId === memberId);
    if (!deserter) {
      throw new NotFoundException('Desertor não encontrado nesta liga');
    }

    await this.leagueRepository.removeDeserter(leagueId, memberId);

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
      deserters: league.deserters.map((d: any) => ({
        memberId: d.memberId,
        memberName: d.memberName,
        desertedAtRound: d.desertedAtRound,
        registeredAt: d.registeredAt,
      })),
      createdAt: league.createdAt,
      updatedAt: league.updatedAt,
    };
  }
}
