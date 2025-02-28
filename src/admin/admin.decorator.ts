import {
  Injectable,
  Dependencies,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_ONLY_KEY } from './admin.guard';

@Injectable()
@Dependencies(Reflector)
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    console.log('Running admin guard');

    //const isAdminOnly = this.reflector.getAllAndOverride(IS_ADMIN_ONLY_KEY, [
    //  context.getHandler(),
    //  context.getClass(),
    //]);
    //if (!isAdminOnly) {
    //  return true;
    //}
    const request = context.switchToHttp().getRequest();

    console.log(`Request: ${JSON.stringify(Object.keys(request))}`);

    return request.user.isAdmin;
  }
}
