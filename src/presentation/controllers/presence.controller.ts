import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HeartbeatDto } from '@application/dtos/presence/heartbeat.dto';
import { PresenceStatsResponseDto } from '@application/dtos/presence/presence-stats-response.dto';
import { GetPresenceStatsUseCase } from '@application/use-cases/presence/get-presence-stats.use-case';
import { RecordHeartbeatUseCase } from '@application/use-cases/presence/record-heartbeat.use-case';

@ApiTags('Presence')
@Controller('presence')
export class PresenceController {
  constructor(
    private recordHeartbeatUseCase: RecordHeartbeatUseCase,
    private getPresenceStatsUseCase: GetPresenceStatsUseCase,
  ) {}

  @Post('heartbeat')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Registrar presença anônima',
    description:
      'Público. Cada navegador envia um UUID v4 periódico. Acessos nos últimos 30 dias entram na contagem de visitantes; pings recentes contam como online.',
  })
  @ApiBody({ type: HeartbeatDto })
  @ApiResponse({ status: 204, description: 'Presença registrada' })
  @ApiResponse({ status: 400, description: 'visitorId inválido' })
  async heartbeat(@Body() dto: HeartbeatDto): Promise<void> {
    await this.recordHeartbeatUseCase.execute(dto.visitorId);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas de acesso ao site',
    description:
      'Público. Visitantes únicos dos últimos 30 dias e quantos estão online na janela de presença.',
  })
  @ApiResponse({ status: 200, description: 'Contagens atuais', type: PresenceStatsResponseDto })
  async stats(): Promise<PresenceStatsResponseDto> {
    return this.getPresenceStatsUseCase.execute();
  }
}
