import { ApiProperty } from '@nestjs/swagger';

export class LeagueMemberResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  joinedAt: Date;
}
