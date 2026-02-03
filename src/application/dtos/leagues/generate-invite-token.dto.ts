import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class GenerateInviteTokenDto {
  @ApiProperty({ required: false, example: 7, description: 'Dias até expirar' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  expiresIn?: number;
}
