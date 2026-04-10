import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { AddGuestMemberDto } from '@application/dtos/leagues/add-guest-member.dto';
import { LeagueMember } from '@domain/entities/league-member.entity';
import { LeagueMemberResponseDto } from '@application/dtos/leagues/league-member-response.dto';

@Injectable()
export class AddGuestMemberUseCase {
  constructor(@Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository) {}

  async execute(leagueId: string, dto: AddGuestMemberDto): Promise<LeagueMemberResponseDto> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundException('Liga não encontrada');
    }

    if (league.members.length >= league.maxParticipants) {
      throw new BadRequestException('Liga está cheia');
    }

    const guestId = new Types.ObjectId().toString();
    const member = new LeagueMember({
      userId: guestId,
      userName: dto.name.trim(),
      joinedAt: new Date(),
      isGuest: dto.isGuest,
      pixKey: dto.pixKey.trim(),
      teamName: dto.teamName.trim(),
    });

    await this.leagueRepository.addMember(leagueId, member);

    return this.toMemberDto(member);
  }

  private toMemberDto(m: LeagueMember): LeagueMemberResponseDto {
    return {
      userId: m.userId,
      userName: m.userName,
      joinedAt: m.joinedAt,
      isGuest: !!m.isGuest,
      pixKey: m.pixKey ?? '',
      teamName: m.teamName ?? '',
    };
  }
}
