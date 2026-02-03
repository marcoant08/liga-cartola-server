import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { UpdateUserDto } from '@application/dtos/users/update-user.dto';
import { UserResponseDto } from '@application/dtos/users/user-response.dto';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userRepository.update(userId, dto);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      teamName: updatedUser.teamName,
      pixKey: updatedUser.pixKey,
      emailVerified: updatedUser.emailVerified,
      leagues: updatedUser.leagues,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
