import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateLeagueUseCase } from '@application/use-cases/leagues/create-league.use-case';
import { GetUserLeaguesUseCase } from '@application/use-cases/leagues/get-user-leagues.use-case';
import { GetLeagueDetailsUseCase } from '@application/use-cases/leagues/get-league-details.use-case';
import { UpdateLeagueUseCase } from '@application/use-cases/leagues/update-league.use-case';
import { GenerateInviteTokenUseCase } from '@application/use-cases/leagues/generate-invite-token.use-case';
import { JoinLeagueUseCase } from '@application/use-cases/leagues/join-league.use-case';
import { AddGuestMemberUseCase } from '@application/use-cases/leagues/add-guest-member.use-case';
import { RemoveLeagueMemberUseCase } from '@application/use-cases/leagues/remove-league-member.use-case';
import { AddDeserterUseCase } from '@application/use-cases/leagues/add-deserter.use-case';
import { RemoveDeserterUseCase } from '@application/use-cases/leagues/remove-deserter.use-case';
import { CreateLeagueDto } from '@application/dtos/leagues/create-league.dto';
import { UpdateLeagueDto } from '@application/dtos/leagues/update-league.dto';
import { GenerateInviteTokenDto } from '@application/dtos/leagues/generate-invite-token.dto';
import { JoinLeagueDto } from '@application/dtos/leagues/join-league.dto';
import { AddGuestMemberDto } from '@application/dtos/leagues/add-guest-member.dto';
import { AddDeserterDto } from '@application/dtos/leagues/add-deserter.dto';
import { LeagueResponseDto } from '@application/dtos/leagues/league-response.dto';
import { LeagueMemberResponseDto } from '@application/dtos/leagues/league-member-response.dto';
import { DeserterResponseDto } from '@application/dtos/leagues/deserter-response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@presentation/guards/optional-jwt-auth.guard';
import { LeagueAdminGuard } from '@presentation/guards/league-admin.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('Leagues')
@Controller('leagues')
@ApiBearerAuth()
export class LeaguesController {
  constructor(
    private createLeagueUseCase: CreateLeagueUseCase,
    private getUserLeaguesUseCase: GetUserLeaguesUseCase,
    private getLeagueDetailsUseCase: GetLeagueDetailsUseCase,
    private updateLeagueUseCase: UpdateLeagueUseCase,
    private generateInviteTokenUseCase: GenerateInviteTokenUseCase,
    private joinLeagueUseCase: JoinLeagueUseCase,
    private addGuestMemberUseCase: AddGuestMemberUseCase,
    private removeLeagueMemberUseCase: RemoveLeagueMemberUseCase,
    private addDeserterUseCase: AddDeserterUseCase,
    private removeDeserterUseCase: RemoveDeserterUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar nova liga' })
  @ApiResponse({ status: 201, description: 'Liga criada com sucesso', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@CurrentUser() user: { sub: string }, @Body() dto: CreateLeagueDto) {
    return this.createLeagueUseCase.execute(user.sub, dto);
  }

  @Post('join')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Entrar em uma liga via token de convite' })
  @ApiResponse({ status: 200, description: 'Entrou na liga com sucesso', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Token inválido/expirado ou liga cheia' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 409, description: 'Já é membro' })
  async join(@CurrentUser() user: { sub: string }, @Body() dto: JoinLeagueDto) {
    return this.joinLeagueUseCase.execute(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar ligas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de ligas', type: [LeagueResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getUserLeagues(@CurrentUser() user: { sub: string }) {
    return this.getUserLeaguesUseCase.execute(user.sub);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Obter detalhes de uma liga',
    description:
      'Bearer opcional. Ligas públicas: qualquer pessoa vê dados sanitizados (sem chave Pix de membros nem token de convite). Membros veem tudo. Liga privada exige JWT e membro.',
  })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 200, description: 'Detalhes da liga', type: LeagueResponseDto })
  @ApiResponse({ status: 401, description: 'Liga privada e não autenticado' })
  @ApiResponse({ status: 403, description: 'Liga privada e usuário não é membro' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async getLeagueDetails(
    @CurrentUser() user: { sub: string } | undefined,
    @Param('id') id: string,
  ) {
    return this.getLeagueDetailsUseCase.execute(id, user?.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
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

  @Post(':id/members')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
  @ApiOperation({ summary: 'Adicionar membro convidado (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 201, description: 'Convidado adicionado', type: LeagueMemberResponseDto })
  @ApiResponse({ status: 400, description: 'Liga cheia ou dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async addGuestMember(@Param('id') id: string, @Body() dto: AddGuestMemberDto) {
    return this.addGuestMemberUseCase.execute(id, dto);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
  @ApiOperation({ summary: 'Remover membro da liga (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiParam({ name: 'memberId', description: 'userId do membro na liga' })
  @ApiResponse({ status: 200, description: 'Membro removido', type: LeagueResponseDto })
  @ApiResponse({ status: 400, description: 'Não é possível remover o administrador' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga ou membro não encontrado' })
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.removeLeagueMemberUseCase.execute(id, memberId);
  }

  @Post(':id/deserters')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
  @ApiOperation({ summary: 'Adicionar desertor à liga (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 201, description: 'Desertor registrado', type: DeserterResponseDto })
  @ApiResponse({ status: 400, description: 'Membro não encontrado ou já é desertor' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async addDeserter(@Param('id') id: string, @Body() dto: AddDeserterDto) {
    return this.addDeserterUseCase.execute(id, dto);
  }

  @Delete(':id/deserters/:memberId')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
  @ApiOperation({ summary: 'Remover desertor da liga (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiParam({ name: 'memberId', description: 'userId do membro desertor' })
  @ApiResponse({ status: 200, description: 'Desertor removido', type: LeagueResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga ou desertor não encontrado' })
  async removeDeserter(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.removeDeserterUseCase.execute(id, memberId);
  }

  @Post(':id/invite-token')
  @UseGuards(JwtAuthGuard, LeagueAdminGuard)
  @ApiOperation({ summary: 'Gerar token de convite temporário' })
  @ApiParam({ name: 'id', description: 'ID da liga' })
  @ApiResponse({ status: 201, description: 'Token gerado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Não é admin' })
  @ApiResponse({ status: 404, description: 'Liga não encontrada' })
  async generateInviteToken(@Param('id') id: string, @Body() dto: GenerateInviteTokenDto) {
    return this.generateInviteTokenUseCase.execute(id, dto);
  }
}
