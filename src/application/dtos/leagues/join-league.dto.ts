import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class JoinLeagueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inviteToken: string;
}
