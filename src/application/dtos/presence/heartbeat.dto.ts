import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class HeartbeatDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador anônimo persistido no navegador (UUID v4)',
  })
  @IsUUID('4')
  @IsNotEmpty()
  visitorId: string;
}
