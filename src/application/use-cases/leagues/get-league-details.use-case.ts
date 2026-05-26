import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class GetLeagueDetailsUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, userId?: string): Promise<LeagueResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    const isPublic = league.isPublic ?? false;
    const isMember = userId
      ? await this.leagueRepository.checkMemberExists(leagueId, userId)
      : false;

    if (isMember) {
      return this.toResponseDto(league, true);
    }

    if (!isPublic) {
      if (!userId) {
        throw new UnauthorizedException(
          'Esta liga é privada (isPublic: false ou não definido). Sem token, só ligas públicas são acessíveis. Peça ao administrador para enviar PUT /leagues/:id com { "isPublic": true } ou autentique-se como membro.',
        );
      }
      throw new ForbiddenException('Você não é membro desta liga');
    }

    return this.toResponseDto(league, false);
  }

  private toResponseDto(league: any, full: boolean): LeagueResponseDto {
    const dto: LeagueResponseDto = {
      id: league.id,
      name: league.name,
      description: league.description,
      adminId: league.adminId,
      roundValue: league.roundValue,
      maxParticipants: league.maxParticipants,
      isPublic: league.isPublic ?? false,
      members: league.members.map((m: any) => ({
        userId: m.userId,
        userName: m.userName,
        joinedAt: m.joinedAt,
        isGuest: !!m.isGuest,
        pixKey: full ? (m.pixKey ?? '') : '',
        teamName: m.teamName ?? '',
      })),
      rounds: league.rounds.map((r: any) => ({
        roundNumber: r.roundNumber,
        winnerId: r.winnerId,
        winnerName: r.winnerName,
        registeredAt: r.registeredAt,
      })),
      deserters: (league.deserters || []).map((d: any) => ({
        memberId: d.memberId,
        memberName: d.memberName,
        desertedAtRound: d.desertedAtRound,
        registeredAt: d.registeredAt,
      })),
      createdAt: league.createdAt,
      updatedAt: league.updatedAt,
    };

    if (full) {
      dto.inviteToken = league.inviteToken;
      dto.inviteTokenExpiresAt = league.inviteTokenExpiresAt;
    }

    return dto;
  }
}
