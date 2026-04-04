import { ApiProperty } from '@nestjs/swagger';

export class LeagueMemberResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty({ description: 'Membro cadastrado manualmente sem conta no sistema' })
  isGuest: boolean;

  @ApiProperty({ required: false })
  pixKey?: string;

  @ApiProperty({ required: false })
  teamName?: string;
}
