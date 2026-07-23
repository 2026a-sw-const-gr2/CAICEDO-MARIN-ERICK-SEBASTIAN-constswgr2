import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export const API_KEY_HEADER = 'x-api-key';

/**
 * Protege la API v2 exigiendo el header `x-api-key`. Se implementa como
 * Guard (y no como middleware) para poder documentarlo con @ApiSecurity y
 * aplicarlo selectivamente solo sobre el endpoint v2.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.header(API_KEY_HEADER);
    const expectedKey = this.configService.get<string>('CARBON_API_KEY');

    if (!expectedKey) {
      throw new UnauthorizedException(
        'El servidor no tiene configurada la variable CARBON_API_KEY.',
      );
    }
    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException(
        `API key inválida o ausente. Envía el header "${API_KEY_HEADER}".`,
      );
    }
    return true;
  }
}
