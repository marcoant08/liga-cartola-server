import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISiteVisitorRepository } from '@domain/interfaces/repositories/site-visitor.repository.interface';
import { SiteVisitor as SiteVisitorSchema, SiteVisitorDocument } from '../schemas/site-visitor.schema';

@Injectable()
export class SiteVisitorRepository implements ISiteVisitorRepository {
  constructor(
    @InjectModel(SiteVisitorSchema.name) private visitorModel: Model<SiteVisitorDocument>,
  ) {}

  async upsertHeartbeat(visitorId: string, at: Date): Promise<void> {
    await this.visitorModel.updateOne(
      { visitorId },
      {
        $set: { lastSeenAt: at },
        $setOnInsert: { visitorId, firstSeenAt: at },
      },
      { upsert: true },
    );
  }

  async countSeenSince(since: Date): Promise<number> {
    return this.visitorModel.countDocuments({ lastSeenAt: { $gte: since } }).exec();
  }
}
