import { ApiProperty } from '@nestjs/swagger';

export class DeserterResponseDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  memberName: string;

  @ApiProperty({ description: 'Rodada em que o membro deixou de participar' })
  desertedAtRound: number;

  @ApiProperty()
  registeredAt: Date;
}
