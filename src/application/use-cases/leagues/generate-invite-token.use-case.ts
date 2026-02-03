import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { GenerateInviteTokenDto } from '@application/dtos/leagues/generate-invite-token.dto';
import * as crypto from 'crypto';

@Injectable()
export class GenerateInviteTokenUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, dto: GenerateInviteTokenDto): Promise<{ inviteToken: string; expiresAt: Date }> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    // Gerar token único
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Calcular data de expiração (padrão 7 dias)
    const expiresInDays = dto.expiresIn || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Atualizar liga com token
    await this.leagueRepository.update(leagueId, {
      inviteToken,
      inviteTokenExpiresAt: expiresAt,
    });

    return { inviteToken, expiresAt };
  }
}
