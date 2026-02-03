import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { UserResponseDto } from '@application/dtos/users/user-response.dto';

@Injectable()
export class GetUserProfileUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      teamName: user.teamName,
      pixKey: user.pixKey,
      emailVerified: user.emailVerified,
      leagues: user.leagues,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
