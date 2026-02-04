import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILeagueRepository } from '@domain/interfaces/repositories/league.repository.interface';
import { League } from '@domain/entities/league.entity';
import { LeagueMember } from '@domain/entities/league-member.entity';
import { Round } from '@domain/entities/round.entity';
import { League as LeagueSchema, LeagueDocument } from '../schemas/league.schema';

@Injectable()
export class LeagueRepository implements ILeagueRepository {
  constructor(
    @InjectModel(LeagueSchema.name) private leagueModel: Model<LeagueDocument>,
  ) {}

  async create(league: League): Promise<League> {
    const createdLeague = new this.leagueModel(league);
    const saved = await createdLeague.save();
    return this.toDomain(saved as any);
  }

  async findById(id: string): Promise<League | null> {
    const league = await this.leagueModel.findById(id).exec();
    return league ? this.toDomain(league as any) : null;
  }

  async findByInviteToken(token: string): Promise<League | null> {
    const league = await this.leagueModel
      .findOne({
        inviteToken: token,
        inviteTokenExpiresAt: { $gt: new Date() },
      })
      .exec();
    return league ? this.toDomain(league as any) : null;
  }

  async findByInviteTokenAny(token: string): Promise<League | null> {
    const league = await this.leagueModel
      .findOne({
        inviteToken: token,
      })
      .exec();
    return league ? this.toDomain(league as any) : null;
  }

  async findByIds(leagueIds: string[]): Promise<League[]> {
    const leagues = await this.leagueModel
      .find({ _id: { $in: leagueIds } })
      .exec();
    // @ts-ignore-next-line
    return leagues.map((league) => this.toDomain(league as any) as any);
  }

  async update(id: string, data: Partial<League>): Promise<League> {
    const updated = await this.leagueModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) {
      throw new Error('League not found');
    }
    return this.toDomain(updated);
  }

  async addMember(leagueId: string, member: LeagueMember): Promise<void> {
    await this.leagueModel.findByIdAndUpdate(leagueId, {
      $addToSet: {
        members: {
          userId: member.userId,
          userName: member.userName,
          joinedAt: member.joinedAt,
        },
      },
    });
  }

  async addRound(leagueId: string, round: Round): Promise<void> {
    // Primeiro, remover a rodada existente se houver (sobrescrever)
    await this.leagueModel.findByIdAndUpdate(leagueId, {
      $pull: {
        rounds: {
          roundNumber: round.roundNumber,
        },
      },
    });

    // Depois, adicionar a nova rodada
    await this.leagueModel.findByIdAndUpdate(leagueId, {
      $push: {
        rounds: {
          roundNumber: round.roundNumber,
          winnerId: round.winnerId,
          winnerName: round.winnerName,
          registeredAt: round.registeredAt,
        },
      },
    });
  }

  async checkMemberExists(leagueId: string, userId: string): Promise<boolean> {
    const league = await this.leagueModel
      .findOne({
        _id: leagueId,
        'members.userId': userId,
      })
      .exec();
    return !!league;
  }

  private toDomain(league: LeagueDocument): League {
    return new League({
      id: league._id.toString(),
      name: league.name,
      description: league.description,
      adminId: league.adminId,
      roundValue: league.roundValue,
      maxParticipants: league.maxParticipants,
      inviteToken: league.inviteToken,
      inviteTokenExpiresAt: league.inviteTokenExpiresAt,
      members: (league.members || []).map(
        (m) =>
          new LeagueMember({
            userId: m.userId,
            userName: m.userName,
            joinedAt: m.joinedAt,
          }),
      ),
      rounds: (league.rounds || []).map(
        (r) =>
          new Round({
            roundNumber: r.roundNumber,
            winnerId: r.winnerId,
            winnerName: r.winnerName,
            registeredAt: r.registeredAt,
          }),
      ),
      createdAt: league.createdAt,
      updatedAt: league.updatedAt,
    });
  }
}
