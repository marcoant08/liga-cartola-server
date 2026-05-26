import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { AddDeserterDto } from '@application/dtos/leagues/add-deserter.dto';
import { Deserter } from '@domain/entities/deserter.entity';
import { DeserterResponseDto } from '@application/dtos/leagues/deserter-response.dto';

@Injectable()
export class AddDeserterUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, dto: AddDeserterDto): Promise<DeserterResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    const member = league.members.find((m) => m.userId === dto.memberId);
    if (!member) {
      throw new BadRequestException('Apenas membros da liga podem ser marcados como desertores');
    }

    const alreadyDeserter = league.deserters.some((d) => d.memberId === dto.memberId);
    if (alreadyDeserter) {
      throw new BadRequestException('Este membro já está registrado como desertor');
    }

    const deserter = new Deserter({
      memberId: dto.memberId,
      memberName: member.userName,
      desertedAtRound: dto.desertedAtRound,
      registeredAt: new Date(),
    });

    await this.leagueRepository.addDeserter(leagueId, deserter);

    return {
      memberId: deserter.memberId,
      memberName: deserter.memberName,
      desertedAtRound: deserter.desertedAtRound,
      registeredAt: deserter.registeredAt,
    };
  }
}
