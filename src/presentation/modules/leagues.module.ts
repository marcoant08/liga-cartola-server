import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { LeaguesController } from '@presentation/controllers/leagues.controller';
import { LeagueRoundsController } from '@presentation/controllers/league-rounds.controller';
import { CreateLeagueUseCase } from '@application/use-cases/leagues/create-league.use-case';
import { GetUserLeaguesUseCase } from '@application/use-cases/leagues/get-user-leagues.use-case';
import { GetLeagueDetailsUseCase } from '@application/use-cases/leagues/get-league-details.use-case';
import { UpdateLeagueUseCase } from '@application/use-cases/leagues/update-league.use-case';
import { GenerateInviteTokenUseCase } from '@application/use-cases/leagues/generate-invite-token.use-case';
import { JoinLeagueUseCase } from '@application/use-cases/leagues/join-league.use-case';
import { GetLeagueRoundsUseCase } from '@application/use-cases/rounds/get-league-rounds.use-case';
import { LeagueRepository } from '@infrastructure/database/mongodb/repositories/league.repository';
import { LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { UserRepository } from '@infrastructure/database/mongodb/repositories/user.repository';
import { USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { League, LeagueSchema } from '@infrastructure/database/mongodb/schemas/league.schema';
import { User, UserSchema } from '@infrastructure/database/mongodb/schemas/user.schema';
import { LeagueAdminGuard } from '@presentation/guards/league-admin.guard';
import { JwtStrategy } from '@presentation/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: League.name, schema: LeagueSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
    ConfigModule,
  ],
  controllers: [LeaguesController, LeagueRoundsController],
  providers: [
    CreateLeagueUseCase,
    GetUserLeaguesUseCase,
    GetLeagueDetailsUseCase,
    UpdateLeagueUseCase,
    GenerateInviteTokenUseCase,
    JoinLeagueUseCase,
    GetLeagueRoundsUseCase,
    LeagueAdminGuard,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: LEAGUE_REPOSITORY, useClass: LeagueRepository },
  ],
})
export class LeaguesModule {}
