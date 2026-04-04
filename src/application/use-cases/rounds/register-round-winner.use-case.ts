import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { RegisterRoundWinnerDto } from '@application/dtos/rounds/register-round-winner.dto';
import { Round } from '@domain/entities/round.entity';
import { RoundResponseDto } from '@application/dtos/rounds/round-response.dto';

@Injectable()
export class RegisterRoundWinnerUseCase {
  constructor(
    @Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository,
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterRoundWinnerDto): Promise<RoundResponseDto> {
    const league = await this.leagueRepository.findById(dto.leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    // Verificar se winnerId é membro da liga
    const isMember = await this.leagueRepository.checkMemberExists(dto.leagueId, dto.winnerId);
    if (!isMember) {
      throw new BadRequestException('O vencedor deve ser membro da liga');
    }

    // Validar número da rodada (1-38)
    if (dto.roundNumber < 1 || dto.roundNumber > 38) {
      throw new BadRequestException('Número da rodada deve estar entre 1 e 38');
    }

    // Nota: Se a rodada já existir, será sobrescrita automaticamente pelo repositório

    const leagueMember = league.members.find((m) => m.userId === dto.winnerId);
    let winnerName: string;
    if (leagueMember?.isGuest) {
      winnerName = leagueMember.userName;
    } else {
      const winner = await this.userRepository.findById(dto.winnerId);
      if (!winner) {
        throw new NotFoundException('Usuário vencedor não encontrado');
      }
      winnerName = winner.name;
    }

    // Criar rodada
    const round = new Round({
      roundNumber: dto.roundNumber,
      winnerId: dto.winnerId,
      winnerName,
      registeredAt: new Date(),
    });

    await this.leagueRepository.addRound(dto.leagueId, round);

    return {
      roundNumber: round.roundNumber,
      winnerId: round.winnerId,
      winnerName: round.winnerName,
      registeredAt: round.registeredAt,
    };
  }
}
