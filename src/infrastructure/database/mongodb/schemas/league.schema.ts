import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeagueDocument = League & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ _id: false })
export class LeagueMember {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, default: Date.now })
  joinedAt: Date;

  @Prop({ required: true })
  isGuest: boolean;

  @Prop({ required: true })
  pixKey: string;

  @Prop({ required: true })
  teamName: string;
}

@Schema({ _id: false })
export class Round {
  @Prop({ required: true, min: 1, max: 38 })
  roundNumber: number;

  @Prop({ required: true })
  winnerId: string;

  @Prop({ required: true })
  winnerName: string;

  @Prop({ required: true, default: Date.now })
  registeredAt: Date;
}

@Schema({ _id: false })
export class Deserter {
  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true })
  memberName: string;

  @Prop({ required: true, min: 1, max: 38 })
  desertedAtRound: number;

  @Prop({ required: true, default: Date.now })
  registeredAt: Date;
}

@Schema({ timestamps: true })
export class League {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true, default: 5 })
  roundValue: number;

  @Prop({ required: true })
  maxParticipants: number;

  @Prop({ required: true, default: false })
  isPublic: boolean;

  @Prop()
  inviteToken?: string;

  @Prop()
  inviteTokenExpiresAt?: Date;

  @Prop({ type: [LeagueMember], default: [] })
  members: LeagueMember[];

  @Prop({ type: [Round], default: [] })
  rounds: Round[];

  @Prop({ type: [Deserter], default: [] })
  deserters: Deserter[];
}

export const LeagueSchema = SchemaFactory.createForClass(League);

// Índices
LeagueSchema.index({ inviteToken: 1 }, { unique: true, sparse: true });

// Validação: roundNumber único dentro do array rounds
LeagueSchema.pre('save', function (next) {
  const rounds = this.rounds || [];
  const roundNumbers = rounds.map((r) => r.roundNumber);
  const uniqueRoundNumbers = [...new Set(roundNumbers)];

  if (roundNumbers.length !== uniqueRoundNumbers.length) {
    return next(new Error('Rodada duplicada não permitida'));
  }

  next();
});

// Validação: userId único dentro do array members
LeagueSchema.pre('save', function (next) {
  const members = this.members || [];
  const userIds = members.map((m) => m.userId);
  const uniqueUserIds = [...new Set(userIds)];

  if (userIds.length !== uniqueUserIds.length) {
    return next(new Error('Usuário duplicado não permitido'));
  }

  next();
});
