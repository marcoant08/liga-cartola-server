import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GetLeagueRoundsUseCase } from '@application/use-cases/rounds/get-league-rounds.use-case';
import { LeagueRoundsResponseDto } from '@application/dtos/rounds/league-rounds-response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeagueRoundsController {
  constructor(private getLeagueRoundsUseCase: GetLeagueRoundsUseCase) {}

  @Get(':id/rounds')
  @ApiOperation({ summary: 'Listar histórico completo de rodadas de uma liga' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 200, description: 'Histórico de rodadas', type: LeagueRoundsResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Usuário não é membro' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async getLeagueRounds(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.getLeagueRoundsUseCase.execute(id, user.sub);
  }
}
