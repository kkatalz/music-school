import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/types/role.enum';
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

    // Custom Error Handling
    const userRoles: Role[] = [];
    if (request?.student?.id) userRoles.push(Role.Student);
    if (request?.teacher?.id) userRoles.push(Role.Teacher);
    if (request?.headTeacher?.id) userRoles.push(Role.HeadTeacher);

    const requiredRoleNames = requiredRoles.join(' or ');
    const userRoleNames =
      userRoles.length > 0 ? userRoles.join(' and ') : 'None (Guest)';

    throw new ForbiddenException(
      `Access denied. Your current role(s) (${userRoleNames}) do not meet the minimum requirement: ${requiredRoleNames}`,
    );
  }
}
