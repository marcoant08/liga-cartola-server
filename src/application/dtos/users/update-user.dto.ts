import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'João Silva' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 'Time do João' })
  @IsString()
  @IsOptional()
  teamName?: string;

  @ApiProperty({ required: false, example: 'joao@example.com' })
  @IsString()
  @IsOptional()
  pixKey?: string;
}
