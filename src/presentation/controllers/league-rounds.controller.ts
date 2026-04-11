import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GetLeagueRoundsUseCase } from '@application/use-cases/rounds/get-league-rounds.use-case';
import { LeagueRoundsResponseDto } from '@application/dtos/rounds/league-rounds-response.dto';
import { OptionalJwtAuthGuard } from '@presentation/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('Leagues')
@Controller('leagues')
@ApiBearerAuth()
export class LeagueRoundsController {
  constructor(private getLeagueRoundsUseCase: GetLeagueRoundsUseCase) {}

  @Get(':id/rounds')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Listar histórico completo de rodadas de uma liga',
    description:
      'Bearer opcional. Mesmas regras de acesso que GET /leagues/:id (liga pública ou membro).',
  })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 200, description: 'Histórico de rodadas', type: LeagueRoundsResponseDto })
  @ApiResponse({ status: 401, description: 'Liga privada e não autenticado' })
  @ApiResponse({ status: 403, description: 'Liga privada e usuário não é membro' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async getLeagueRounds(
    @CurrentUser() user: { sub: string } | undefined,
    @Param('id') id: string,
  ) {
    return this.getLeagueRoundsUseCase.execute(id, user?.sub);
  }
}
