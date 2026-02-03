import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IJwtService, JWT_SERVICE } from '@domain/interfaces/services/jwt.service.interface';
import { RefreshTokenDto } from '@application/dtos/auth/refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(@Inject(JWT_SERVICE) private jwtService: IJwtService) {}

  async execute(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verifyRefresh(dto.refreshToken);
      const accessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
      }).accessToken;

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
