import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterRoundWinnerUseCase } from '@application/use-cases/rounds/register-round-winner.use-case';
import { RegisterRoundWinnerDto } from '@application/dtos/rounds/register-round-winner.dto';
import { RoundResponseDto } from '@application/dtos/rounds/round-response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { LeagueAdminGuard } from '@presentation/guards/league-admin.guard';

@ApiTags('Rounds')
@Controller('rounds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoundsController {
  constructor(private registerRoundWinnerUseCase: RegisterRoundWinnerUseCase) {}

  @Post()
  @UseGuards(LeagueAdminGuard)
  @ApiOperation({ summary: 'Registrar campeão da rodada (apenas admin da liga)' })
  @ApiResponse({ status: 201, description: 'Rodada registrada com sucesso', type: RoundResponseDto })
  @ApiResponse({ status: 400, description: 'Validação: roundNumber fora de 1-38, rodada duplicada, winnerId não é membro' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async registerRoundWinner(@Body() dto: RegisterRoundWinnerDto) {
    return this.registerRoundWinnerUseCase.execute(dto);
  }
}
