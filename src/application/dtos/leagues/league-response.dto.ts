import { ApiProperty } from '@nestjs/swagger';
import { LeagueMemberResponseDto } from './league-member-response.dto';
import { RoundResponseDto } from '../rounds/round-response.dto';

export class LeagueResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  adminId: string;

  @ApiProperty()
  roundValue: number;

  @ApiProperty()
  maxParticipants: number;

  @ApiProperty({ description: 'Liga visível sem login (somente leitura sanitizada para não membros)' })
  isPublic: boolean;

  @ApiProperty({ required: false })
  inviteToken?: string;

  @ApiProperty({ required: false })
  inviteTokenExpiresAt?: Date;

  @ApiProperty({ type: [LeagueMemberResponseDto] })
  members: LeagueMemberResponseDto[];

  @ApiProperty({ type: [RoundResponseDto] })
  rounds: RoundResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
