import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  teamName: string;

  @Prop({ default: '' })
  pixKey: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  emailVerificationCode?: string;

  @Prop()
  emailVerificationExpiresAt?: Date;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  leagues: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índice único para email (removido unique: true do @Prop para evitar duplicação)
UserSchema.index({ email: 1 }, { unique: true });
