import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from '@presentation/controllers/users.controller';
import { GetUserProfileUseCase } from '@application/use-cases/users/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/use-cases/users/update-user-profile.use-case';
import { UserRepository } from '@infrastructure/database/mongodb/repositories/user.repository';
import { USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { User, UserSchema } from '@infrastructure/database/mongodb/schemas/user.schema';
import { JwtStrategy } from '@presentation/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
