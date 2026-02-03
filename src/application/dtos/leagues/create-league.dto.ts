import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty({ example: 'Liga dos Campeões' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Liga para disputa do campeonato' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 5, default: 5 })
  @IsNumber()
  @Min(1)
  roundValue: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(2)
  maxParticipants: number;
}
