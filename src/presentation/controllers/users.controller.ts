import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUserProfileUseCase } from '@application/use-cases/users/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/use-cases/users/update-user-profile.use-case';
import { UpdateUserDto } from '@application/dtos/users/update-user.dto';
import { UserResponseDto } from '@application/dtos/users/user-response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private getUserProfileUseCase: GetUserProfileUseCase,
    private updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtido com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getProfile(@CurrentUser() user: { sub: string }) {
    return this.getUserProfileUseCase.execute(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async updateProfile(@CurrentUser() user: { sub: string }, @Body() dto: UpdateUserDto) {
    return this.updateUserProfileUseCase.execute(user.sub, dto);
  }
}
