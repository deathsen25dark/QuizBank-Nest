import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../../users/enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('roles guard đang chạy')
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(  // Kiểm tra có metadata nào 
      ROLES_KEY,                                                         // có key (trong cặp key - value) là rolesKey không (vì ROLES_KEY = 'rolesKey')
      [
        context.getHandler(),                                            // kiểm tra ở handler
        context.getClass(),                                              // sau mới kiểm tra ở class
      ],
    );
    console.log('requiredRoles:', requiredRoles)
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('user là', user)
    return requiredRoles.includes(user.role);
  }
}