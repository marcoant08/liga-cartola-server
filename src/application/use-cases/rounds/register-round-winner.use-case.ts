import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { RegisterRoundWinnerDto } from '@application/dtos/rounds/register-round-winner.dto';
import { Round } from '@domain/entities/round.entity';
import { RoundResponseDto } from '@application/dtos/rounds/round-response.dto';

@Injectable()
export class RegisterRoundWinnerUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(dto: RegisterRoundWinnerDto, adminId: string): Promise<RoundResponseDto> {
    const league = await this.leagueRepository.findById(dto.leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    // Verificar se winnerId é membro da liga
    const isMember = await this.leagueRepository.checkMemberExists(dto.leagueId, dto.winnerId);
    if (!isMember) {
      throw new BadRequestException('O vencedor deve ser membro da liga');
    }

    // Verificar se rodada já existe
    const existingRound = league.rounds.find((r) => r.roundNumber === dto.roundNumber);
    if (existingRound) {
      throw new BadRequestException('Rodada já registrada');
    }

    // Validar número da rodada (1-38)
    if (dto.roundNumber < 1 || dto.roundNumber > 38) {
      throw new BadRequestException('Número da rodada deve estar entre 1 e 38');
    }

    // Criar rodada
    const round = new Round({
      roundNumber: dto.roundNumber,
      winnerId: dto.winnerId,
      registeredAt: new Date(),
      registeredBy: adminId,
    });

    await this.leagueRepository.addRound(dto.leagueId, round);

    return {
      roundNumber: round.roundNumber,
      winnerId: round.winnerId,
      registeredAt: round.registeredAt,
      registeredBy: round.registeredBy,
    };
  }
}
