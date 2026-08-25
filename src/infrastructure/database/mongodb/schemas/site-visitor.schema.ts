import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteVisitorDocument = SiteVisitor & Document;

@Schema({ collection: 'site_visitors', timestamps: false })
export class SiteVisitor {
  @Prop({ required: true })
  visitorId: string;

  @Prop({ required: true })
  firstSeenAt: Date;

  @Prop({ required: true })
  lastSeenAt: Date;
}

export const SiteVisitorSchema = SchemaFactory.createForClass(SiteVisitor);

SiteVisitorSchema.index({ visitorId: 1 }, { unique: true });
SiteVisitorSchema.index({ lastSeenAt: 1 });
