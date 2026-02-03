import { ApiProperty } from '@nestjs/swagger';
import { RoundResponseDto } from './round-response.dto';

export class LeagueRoundsResponseDto {
  @ApiProperty({ type: [RoundResponseDto] })
  rounds: RoundResponseDto[];
}
