export const JWT_SERVICE = 'JWT_SERVICE';

export interface Payload {
  sub: string;
  email: string;
}

export interface IJwtService {
  sign(payload: Payload): { accessToken: string; refreshToken: string };
  verify(token: string): Payload;
  verifyRefresh(token: string): Payload;
}
