import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { JoinLeagueDto } from '@application/dtos/leagues/join-league.dto';
import { LeagueMember } from '@domain/entities/league-member.entity';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';

@Injectable()
export class JoinLeagueUseCase {
  constructor(
    @Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository,
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: JoinLeagueDto): Promise<LeagueResponseDto> {
    // Buscar liga pelo token
    const league = await this.leagueRepository.findByInviteToken(dto.inviteToken);
    if (!league) {
      throw new BadRequestException('Token de convite inválido ou expirado');
    }

    // Verificar se usuário já é membro
    const isMember = await this.leagueRepository.checkMemberExists(league.id, userId);
    if (isMember) {
      throw new ConflictException('Você já é membro desta liga');
    }

    // Verificar se liga está cheia
    if (league.members.length >= league.maxParticipants) {
      throw new BadRequestException('Liga está cheia');
    }

    // Buscar dados do usuário para obter o nome
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Adicionar membro à liga
    const member = new LeagueMember({
      userId: userId,
      userName: user.name,
      joinedAt: new Date(),
      isGuest: dto.isGuest,
      pixKey: dto.pixKey.trim(),
      teamName: dto.teamName.trim(),
    });

    await this.leagueRepository.addMember(league.id, member);

    // Adicionar liga ao array de ligas do usuário
    await this.userRepository.addLeague(userId, league.id);

    // Buscar liga atualizada
    const updatedLeague = await this.leagueRepository.findById(league.id);
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
      deserters: (league.deserters || []).map((d: any) => ({
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
