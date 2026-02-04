import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

    // Gerar token único de 7 caracteres hexadecimais
    let inviteToken: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      // Gerar 4 bytes (32 bits) e pegar apenas os primeiros 7 caracteres hexadecimais
      inviteToken = crypto.randomBytes(4).toString('hex').substring(0, 7);
      
      // Verificar se o token já existe (verificar qualquer token, não apenas válidos)
      const existingLeague = await this.leagueRepository.findByInviteTokenAny(inviteToken);
      
      if (!existingLeague || existingLeague.id === leagueId) {
        // Token não existe ou é da mesma liga (permitir reutilização)
        break;
      }
      
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new ConflictException('Não foi possível gerar um token único. Tente novamente.');
    }

    // Calcular data de expiração (padrão 7 dias)
    const expiresInDays = dto.expiresIn || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Atualizar liga com token
    try {
      await this.leagueRepository.update(leagueId, {
        inviteToken,
        inviteTokenExpiresAt: expiresAt,
      });
    } catch (error: any) {
      // Se houver erro de duplicação (índice único), tentar novamente
      if (error.code === 11000 || error.message?.includes('duplicate')) {
        throw new ConflictException('Token já existe. Tente novamente.');
      }
      throw error;
    }

    return { inviteToken, expiresAt };
  }
}
