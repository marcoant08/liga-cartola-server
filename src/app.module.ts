import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './presentation/modules/auth.module';
import { UsersModule } from './presentation/modules/users.module';
import { LeaguesModule } from './presentation/modules/leagues.module';
import { RoundsModule } from './presentation/modules/rounds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/cartola'),
    AuthModule,
    UsersModule,
    LeaguesModule,
    RoundsModule,
  ],
})
export class AppModule {}
