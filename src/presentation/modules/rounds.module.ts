import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RoundsController } from '@presentation/controllers/rounds.controller';
import { RegisterRoundWinnerUseCase } from '@application/use-cases/rounds/register-round-winner.use-case';
import { LeagueRepository } from '@infrastructure/database/mongodb/repositories/league.repository';
import { LEAGUE_REPOSITORY } from '@domain/interfaces/repositories/league.repository.interface';
import { League, LeagueSchema } from '@infrastructure/database/mongodb/schemas/league.schema';
import { LeagueAdminGuard } from '@presentation/guards/league-admin.guard';
import { JwtStrategy } from '@presentation/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeagueSchema }]),
    PassportModule,
    ConfigModule,
  ],
  controllers: [RoundsController],
  providers: [
    RegisterRoundWinnerUseCase,
    LeagueAdminGuard,
    JwtStrategy,
    {
      provide: LEAGUE_REPOSITORY,
      useClass: LeagueRepository,
    },
  ],
})
export class RoundsModule {}
