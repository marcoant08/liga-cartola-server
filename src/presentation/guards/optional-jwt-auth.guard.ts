import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      return true;
    }
    try {
      await super.canActivate(context);
      return true;
    } catch {
      request.user = undefined;
      return true;
    }
  }

  override handleRequest<TUser = unknown>(err: unknown, user: unknown): TUser {
    if (err || !user) {
      return undefined as TUser;
    }
    return user as TUser;
  }
}
