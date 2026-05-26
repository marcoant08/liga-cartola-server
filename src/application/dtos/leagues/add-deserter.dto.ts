import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class AddDeserterDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'userId do membro que desistiu' })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({ example: 14, description: 'Rodada em que o membro deixou de participar' })
  @IsInt()
  @Min(1)
  @Max(38)
  desertedAtRound: number;
}
