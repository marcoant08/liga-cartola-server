import { ApiProperty } from '@nestjs/swagger';

export class RoundResponseDto {
  @ApiProperty()
  roundNumber: number;

  @ApiProperty()
  winnerId: string;

  @ApiProperty()
  winnerName: string;

  @ApiProperty()
  registeredAt: Date;

  @ApiProperty()
  registeredBy: string;
}
