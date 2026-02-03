import { Injectable, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories/user.repository.interface';
import { IEmailService, EMAIL_SERVICE } from '@domain/interfaces/services/email.service.interface';
import { RegisterDto } from '@application/dtos/auth/register.dto';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(EMAIL_SERVICE) private emailService: IEmailService,
  ) {}

  async execute(dto: RegisterDto): Promise<{ userId: string; message: string }> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Gerar código de verificação
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Criar usuário
    const user = new User({
      email: dto.email.toLowerCase(),
      name: dto.name,
      teamName: dto.teamName,
      pixKey: dto.pixKey,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpiresAt: expiresAt,
      leagues: [],
    });

    const createdUser = await this.userRepository.create(user);

    // Enviar email com código
    await this.emailService.sendVerificationCode(dto.email, verificationCode);

    return {
      userId: createdUser.id,
      message: 'Usuário criado com sucesso. Verifique seu email para ativar a conta.',
    };
  }
}
