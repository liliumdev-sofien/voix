import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('RolesGuard: User', user);
    console.log('RolesGuard: Required Roles', requiredRoles);
    
    if (!user) {
        console.log('RolesGuard: No user found in request');
        return false;
    }
    
    const hasRole = requiredRoles.includes(user.role);
    console.log(`RolesGuard: Access granted? ${hasRole}`);
    return hasRole;
  }
}
