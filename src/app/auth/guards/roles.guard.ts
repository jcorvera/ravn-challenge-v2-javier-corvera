import { Reflector } from '@nestjs/core';
import { Role } from '@common/enums/roles.enum';
import { UsersService } from '@users/services/users.service';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean | never> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    try {
      const result = await this.usersService.finOneByRole(user.roles[0].roleId, user.id);
      user.roles = user.roles.map(() => result);
      return requiredRoles.some((role) => user.roles?.includes(role));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
