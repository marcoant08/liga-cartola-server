import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { LeagueRoundsResponseDto } from '@application/dtos/rounds/league-rounds-response.dto';

@Injectable()
export class GetLeagueRoundsUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, userId?: string): Promise<LeagueRoundsResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    const isPublic = league.isPublic ?? false;
    const isMember = userId
      ? await this.leagueRepository.checkMemberExists(leagueId, userId)
      : false;

    if (!isMember && !isPublic) {
      if (!userId) {
        throw new UnauthorizedException(
          'Esta liga é privada (isPublic: false ou não definido). Sem token, só ligas públicas são acessíveis. Peça ao administrador para enviar PUT /leagues/:id com { "isPublic": true } ou autentique-se como membro.',
        );
      }
      throw new ForbiddenException('Você não é membro desta liga');
    }

    return {
      rounds: league.rounds.map((r) => ({
        roundNumber: r.roundNumber,
        winnerId: r.winnerId,
        winnerName: r.winnerName,
        registeredAt: r.registeredAt,
      })),
    };
  }
}
