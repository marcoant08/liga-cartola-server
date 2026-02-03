import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { VerifyEmailDto } from '@application/dtos/auth/verify-email.dto';

@Injectable()
export class VerifyEmailUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepository: IUserRepository) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string; verified: boolean }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.emailVerified) {
      return { message: 'Email já verificado', verified: true };
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpiresAt) {
      throw new BadRequestException('Código de verificação não encontrado');
    }

    if (new Date() > user.emailVerificationExpiresAt) {
      throw new BadRequestException('Código de verificação expirado');
    }

    if (user.emailVerificationCode !== dto.code) {
      throw new BadRequestException('Código de verificação inválido');
    }

    await this.userRepository.verifyEmail(user.id);

    return { message: 'Email verificado com sucesso', verified: true };
  }
}
