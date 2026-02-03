import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.use-case';
import { VerifyEmailUseCase } from '@application/use-cases/auth/verify-email.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { UserRepository } from '@infrastructure/database/mongodb/repositories/user.repository';
import { USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { EmailServiceImpl } from '@infrastructure/services/email/email.service';
import { EMAIL_SERVICE } from '@domain/interfaces/services/email.service.interface';
import { JwtServiceImpl } from '@infrastructure/services/jwt/jwt.service';
import { JWT_SERVICE } from '@domain/interfaces/services/jwt.service.interface';
import { JwtStrategy } from '@presentation/strategies/jwt.strategy';
import { User, UserSchema } from '@infrastructure/database/mongodb/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    VerifyEmailUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: EmailServiceImpl,
    },
    {
      provide: JWT_SERVICE,
      useClass: JwtServiceImpl,
    },
  ],
  exports: [JWT_SERVICE, JwtStrategy],
})
export class AuthModule {}
