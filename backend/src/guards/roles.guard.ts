import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/role.enum';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { AuthRequest } from 'src/types/expressRequest.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (request?.student?.id && requiredRoles.includes(Role.Student)) {
      return true;
    }
    if (request?.teacher?.id && requiredRoles.includes(Role.Teacher)) {
      return true;
    }
    if (request?.headTeacher?.id && requiredRoles.includes(Role.HeadTeacher)) {
      return true;
    }
    return false;
  }
}
