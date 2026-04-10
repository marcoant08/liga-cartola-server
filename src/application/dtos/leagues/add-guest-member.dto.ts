import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsBoolean, Equals } from 'class-validator';

export class AddGuestMemberDto {
  @ApiProperty({ example: 'João Convidado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  pixKey: string;

  @ApiProperty({ example: 'Time do João' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  teamName: string;

  @ApiProperty({ example: true, description: 'Membro convidado sem conta (sempre true)' })
  @IsBoolean()
  @Equals(true)
  isGuest: boolean;
}
