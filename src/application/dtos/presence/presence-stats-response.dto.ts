import { ApiProperty } from '@nestjs/swagger';

export class PresenceStatsResponseDto {
  @ApiProperty({ description: 'Visitantes únicos com acesso no último mês (janela móvel)' })
  uniqueVisitors: number;

  @ApiProperty({ description: 'Visitantes com heartbeat dentro da janela de presença' })
  onlineNow: number;

  @ApiProperty({ description: 'Janela em segundos para considerar alguém online' })
  onlineWindowSeconds: number;

  @ApiProperty({ description: 'Janela em dias da contagem de visitantes únicos' })
  uniqueVisitorsWindowDays: number;
}
