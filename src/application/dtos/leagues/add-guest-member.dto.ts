import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddGuestMemberDto {
  @ApiProperty({ example: 'João Convidado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsString()
  @IsOptional()
  pixKey?: string;

  @ApiProperty({ example: 'Time do João', required: false })
  @IsString()
  @IsOptional()
  teamName?: string;
}
