import { LeagueMember } from './league-member.entity';
import { Round } from './round.entity';
import { Deserter } from './deserter.entity';

export class League {
  id: string;
  name: string;
  description: string;
  adminId: string;
  roundValue: number;
  maxParticipants: number;
  isPublic: boolean;
  inviteToken?: string;
  inviteTokenExpiresAt?: Date;
  members: LeagueMember[];
  rounds: Round[];
  deserters: Deserter[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<League>) {
    Object.assign(this, partial);
    this.members = this.members || [];
    this.rounds = this.rounds || [];
    this.deserters = this.deserters || [];
  }
}
