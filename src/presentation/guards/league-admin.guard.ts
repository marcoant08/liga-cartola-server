import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ILeagueRepository, LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class LeagueAdminGuard implements CanActivate {
  constructor(
    @Inject(LEAGUE_REPOSITORY) private leagueRepository: ILeagueRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const leagueId = request.params.id || request.body.leagueId;

    if (!leagueId) {
      throw new ForbiddenException('ID da liga não fornecido');
    }

    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new ForbiddenException('Liga não encontrada');
    }

    if (league.adminId !== user.sub) {
      throw new ForbiddenException('Apenas o administrador da liga pode realizar esta ação');
    }

    return true;
  }
}
