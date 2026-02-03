import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { User as UserSchema, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    const saved = await createdUser.save();
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    return user ? this.toDomain(user) : null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) {
      throw new Error('User not found');
    }
    return this.toDomain(updated);
  }

  async verifyEmail(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      emailVerified: true,
      emailVerificationCode: undefined,
      emailVerificationExpiresAt: undefined,
    });
  }

  async addLeague(userId: string, leagueId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { leagues: leagueId },
    });
  }

  async removeLeague(userId: string, leagueId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { leagues: leagueId },
    });
  }

  private toDomain(user: UserDocument): User {
    return new User({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      teamName: user.teamName,
      pixKey: user.pixKey,
      emailVerified: user.emailVerified,
      emailVerificationCode: user.emailVerificationCode,
      emailVerificationExpiresAt: user.emailVerificationExpiresAt,
      password: user.password,
      leagues: user.leagues || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
