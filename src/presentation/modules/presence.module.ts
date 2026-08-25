import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetPresenceStatsUseCase } from '@application/use-cases/presence/get-presence-stats.use-case';
import { RecordHeartbeatUseCase } from '@application/use-cases/presence/record-heartbeat.use-case';
import { SITE_VISITOR_REPOSITORY } from '@domain/interfaces/repositories/site-visitor.repository.interface';
import { SiteVisitorRepository } from '@infrastructure/database/mongodb/repositories/site-visitor.repository';
import { SiteVisitor, SiteVisitorSchema } from '@infrastructure/database/mongodb/schemas/site-visitor.schema';
import { PresenceController } from '@presentation/controllers/presence.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteVisitor.name, schema: SiteVisitorSchema }])],
  controllers: [PresenceController],
  providers: [
    RecordHeartbeatUseCase,
    GetPresenceStatsUseCase,
    { provide: SITE_VISITOR_REPOSITORY, useClass: SiteVisitorRepository },
  ],
})
export class PresenceModule {}
