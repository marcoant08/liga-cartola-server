import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsBoolean, Equals } from 'class-validator';

export class JoinLeagueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inviteToken: string;

  @ApiProperty({ example: 'email@exemplo.com ou chave Pix' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  pixKey: string;

  @ApiProperty({ example: 'Meu time do Cartola' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  teamName: string;

  @ApiProperty({ example: false, description: 'Quem entra pelo convite é usuário cadastrado (sempre false)' })
  @IsBoolean()
  @Equals(false)
  isGuest: boolean;
}
