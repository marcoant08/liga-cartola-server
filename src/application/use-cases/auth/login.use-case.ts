import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { IJwtService, JWT_SERVICE } from '@domain/interfaces/services/jwt.service.interface';
import { LoginDto } from '@application/dtos/auth/login.dto';
import { UserResponseDto } from '@application/dtos/users/user-response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(JWT_SERVICE) private jwtService: IJwtService,
  ) {}

  async execute(dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
  }> {
    console.log('[email]', dto.email);
    const user = await this.userRepository.findByEmail(dto.email);
    console.log('[user]', user);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Email não verificado');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const userResponse: UserResponseDto = {
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

    return {
      ...tokens,
      user: userResponse,
    };
  }
}
