import { ApiProperty } from '@nestjs/swagger';

export class LeagueMemberResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  isAdmin: boolean;
}
