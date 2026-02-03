import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateLeagueUseCase } from '@application/use-cases/leagues/create-league.use-case';
import { GetUserLeaguesUseCase } from '@application/use-cases/leagues/get-user-leagues.use-case';
import { GetLeagueDetailsUseCase } from '@application/use-cases/leagues/get-league-details.use-case';
import { UpdateLeagueUseCase } from '@application/use-cases/leagues/update-league.use-case';
import { GenerateInviteTokenUseCase } from '@application/use-cases/leagues/generate-invite-token.use-case';
import { JoinLeagueUseCase } from '@application/use-cases/leagues/join-league.use-case';
import { CreateLeagueDto } from '@application/dtos/leagues/create-league.dto';
import { UpdateLeagueDto } from '@application/dtos/leagues/update-league.dto';
import { GenerateInviteTokenDto } from '@application/dtos/leagues/generate-invite-token.dto';
import { JoinLeagueDto } from '@application/dtos/leagues/join-league.dto';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { LeagueAdminGuard } from '@presentation/guards/league-admin.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('Leagues')
@Controller('leagues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeaguesController {
  constructor(
    private createLeagueUseCase: CreateLeagueUseCase,
    private getUserLeaguesUseCase: GetUserLeaguesUseCase,
    private getLeagueDetailsUseCase: GetLeagueDetailsUseCase,
    private updateLeagueUseCase: UpdateLeagueUseCase,
    private generateInviteTokenUseCase: GenerateInviteTokenUseCase,
    private joinLeagueUseCase: JoinLeagueUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova liga' })
  @ApiResponse({ status: 201, description: 'Liga criada com sucesso', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@CurrentUser() user: { sub: string }, @Body() dto: CreateLeagueDto) {
    return this.createLeagueUseCase.execute(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ligas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de ligas', type: [LeagueResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getUserLeagues(@CurrentUser() user: { sub: string }) {
    return this.getUserLeaguesUseCase.execute(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma liga' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 200, description: 'Detalhes da liga', type: LeagueResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Usuário não é membro' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async getLeagueDetails(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.getLeagueDetailsUseCase.execute(id, user.sub);
  }

  @Put(':id')
  @UseGuards(LeagueAdminGuard)
  @ApiOperation({ summary: 'Atualizar liga (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 200, description: 'Liga atualizada com sucesso', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateLeagueDto) {
    return this.updateLeagueUseCase.execute(id, dto);
  }

  @Post(':id/invite-token')
  @UseGuards(LeagueAdminGuard)
  @ApiOperation({ summary: 'Gerar token de convite temporário' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 201, description: 'Token gerado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async generateInviteToken(@Param('id') id: string, @Body() dto: GenerateInviteTokenDto) {
    return this.generateInviteTokenUseCase.execute(id, dto);
  }

  @Post('join')
  @ApiOperation({ summary: 'Entrar em uma liga via token de convite' })
  @ApiResponse({ status: 200, description: 'Entrou na liga com sucesso', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Token inválido/expirado ou liga cheia' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 409, description: 'Já é membro' })
  async join(@CurrentUser() user: { sub: string }, @Body() dto: JoinLeagueDto) {
    return this.joinLeagueUseCase.execute(user.sub, dto);
  }
}
