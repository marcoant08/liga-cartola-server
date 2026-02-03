import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  teamName: string;

  @ApiProperty()
  pixKey: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty({ type: [String] })
  leagues: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
