import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class RegisterRoundWinnerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  leagueId: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 38 })
  @IsNumber()
  @Min(1)
  @Max(38)
  roundNumber: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  winnerId: string;
}
