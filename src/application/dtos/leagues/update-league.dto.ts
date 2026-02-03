import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, MaxLength } from 'class-validator';

export class UpdateLeagueDto {
  @ApiProperty({ required: false, example: 'Liga dos Campeões' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, example: 'Liga para disputa do campeonato' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false, example: 5 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  roundValue?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNumber()
  @Min(2)
  @IsOptional()
  maxParticipants?: number;
}
