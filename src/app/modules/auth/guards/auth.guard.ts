import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AUTH_META, AUTH_TOKEN_META } from 'src/app/interfaces/auth.enum';
import { RoleUserEnum } from 'src/app/interfaces/role.enum';
import { IAttachedUserRequest } from 'src/app/interfaces/IAttachedUserRequest';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  getAccessToken(request: Request) {
    try {
      const authorizationHeader: string = request.headers['authorization'];
      if (!authorizationHeader) {
        throw new Error();
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new Error();
      }
      return accessToken;
    } catch (error) {
      return undefined;
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controller = context.getClass();
    const handleOverrideController =
      this.reflector.getAllAndOverride(AUTH_META.TOKEN_META, [
        handler,
        controller,
      ]) ?? AUTH_TOKEN_META.PUBLIC;
    switch (handleOverrideController) {
      case AUTH_TOKEN_META.PUBLIC: {
        return true;
      }

      case AUTH_TOKEN_META.WITH_ACTIVE_TOKEN_ONLY: {
        try {
          const request = context.switchToHttp().getRequest();
          const AT = this.getAccessToken(request);
          if (AT === undefined) {
            throw new ForbiddenException();
          }
          const user = await this.authService.verifyAccessToken(AT);

          const requiredRoles = this.reflector.getAllAndOverride<RoleUserEnum>(
            'role',
            [context.getHandler(), context.getClass()],
          );
          if (!requiredRoles) {
            (request as IAttachedUserRequest).user = user;
          }
          if (user?.role !== requiredRoles) {
            throw new UnauthorizedException();
          }
          (request as IAttachedUserRequest).user = user;
          return true;
        } catch (error) {
          if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException();
          }
          return false;
        }
      }

      case AUTH_TOKEN_META.WITH_EXPIRED_TOKEN_ONLY: {
        try {
          const request = context.switchToHttp().getRequest();
          const AT = this.getAccessToken(request);
          if (AT === undefined) {
            throw new Error();
          }

          return this.authService.isTokenExpired(AT);
        } catch (error) {
          console.log(error);
          return false;
        }
      }

      case AUTH_TOKEN_META.WITHOUT_TOKEN_ONLY: {
        try {
          const request: Request = context.switchToHttp().getRequest();
          const authorizationHeader: string = request.headers['authorization'];
          if (authorizationHeader) {
            throw new Error();
          }
          return true;
        } catch (error) {
          return false;
        }
      }
    }
    return false;
  }
}
