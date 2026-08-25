import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './presentation/modules/auth.module';
import { UsersModule } from './presentation/modules/users.module';
import { LeaguesModule } from './presentation/modules/leagues.module';
import { PresenceModule } from './presentation/modules/presence.module';
import { RoundsModule } from './presentation/modules/rounds.module';
import { RootController } from './presentation/controllers/root.controller';

function mongoUriOrThrow(): string {
  const uri = process.env.MONGODB_URI;
  if (uri?.trim()) {
    return uri.trim();
  }
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new Error(
      'MONGODB_URI não está definida. Configure a variável no painel da Vercel (Settings → Environment Variables).',
    );
  }
  return 'mongodb://localhost:27017/cartola';
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(mongoUriOrThrow(), {
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
      socketTimeoutMS: 8_000,
      maxPoolSize: 3,
      minPoolSize: 0,
    }),
    AuthModule,
    UsersModule,
    LeaguesModule,
    PresenceModule,
    RoundsModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
