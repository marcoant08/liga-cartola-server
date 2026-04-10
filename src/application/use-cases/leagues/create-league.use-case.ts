import { Injectable, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { CreateLeagueDto } from '@application/dtos/leagues/create-league.dto';
import { League } from '@domain/entities/league.entity';
import { LeagueMember } from '@domain/entities/league-member.entity';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class CreateLeagueUseCase {
  constructor(
    @Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository,
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: CreateLeagueDto): Promise<LeagueResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const pixKey = (user.pixKey ?? '').trim();
    const teamName = (user.teamName ?? '').trim();
    if (!pixKey || !teamName) {
      throw new BadRequestException(
        'Complete chave Pix e nome do time no perfil antes de criar uma liga.',
      );
    }

    // Criar liga
    const league = new League({
      name: dto.name,
      description: dto.description,
      adminId: userId,
      roundValue: dto.roundValue || 5,
      maxParticipants: dto.maxParticipants,
      members: [],
      rounds: [],
    });

    const createdLeague = await this.leagueRepository.create(league);

    // Adicionar admin como primeiro membro
    const adminMember = new LeagueMember({
      userId: userId,
      userName: user.name,
      joinedAt: new Date(),
      isGuest: false,
      pixKey,
      teamName,
    });

    await this.leagueRepository.addMember(createdLeague.id, adminMember);

    // Adicionar liga ao array de ligas do usuário
    await this.userRepository.addLeague(userId, createdLeague.id);

    // Buscar liga atualizada
    const updatedLeague = await this.leagueRepository.findById(createdLeague.id);

    return this.toResponseDto(updatedLeague!);
  }

  private toResponseDto(league: League): LeagueResponseDto {
    return {
      id: league.id,
      name: league.name,
      description: league.description,
      adminId: league.adminId,
      roundValue: league.roundValue,
      maxParticipants: league.maxParticipants,
      inviteToken: league.inviteToken,
      inviteTokenExpiresAt: league.inviteTokenExpiresAt,
      members: league.members.map((m) => ({
        userId: m.userId,
        userName: m.userName,
        joinedAt: m.joinedAt,
        isGuest: !!m.isGuest,
        pixKey: m.pixKey ?? '',
        teamName: m.teamName ?? '',
      })),
      rounds: league.rounds.map((r) => ({
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
