import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtService, Payload } from '@domain/interfaces/services/jwt.service.interface';

@Injectable()
export class JwtServiceImpl implements IJwtService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  sign(payload: Payload): { accessToken: string; refreshToken: string } {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT_SECRET e JWT_REFRESH_SECRET devem estar configurados');
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  verify(token: string): Payload {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET deve estar configurado');
    }
    return this.jwtService.verify(token, {
      secret: jwtSecret,
    });
  }

  verifyRefresh(token: string): Payload {
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET deve estar configurado');
    }
    return this.jwtService.verify(token, {
      secret: jwtRefreshSecret,
    });
  }
}
