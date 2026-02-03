import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { LeagueRoundsResponseDto } from '@application/dtos/rounds/league-rounds-response.dto';

@Injectable()
export class GetLeagueRoundsUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, userId: string): Promise<LeagueRoundsResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    // Verificar se usuário é membro
    const isMember = await this.leagueRepository.checkMemberExists(leagueId, userId);
    if (!isMember) {
      throw new ForbiddenException('Você não é membro desta liga');
    }

    return {
      rounds: league.rounds.map((r) => ({
        roundNumber: r.roundNumber,
        winnerId: r.winnerId,
        registeredAt: r.registeredAt,
        registeredBy: r.registeredBy,
      })),
    };
  }
}
