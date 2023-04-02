import { RoleResponseDoc } from './role.response.doc';
import { UserResponseDoc } from './user.response.doc';

export class UserRolesResponseDoc {
  user?: UserResponseDoc;
  userId?: number;
  role?: RoleResponseDoc;
  roleId?: number;
  createdAt?: string;
  updatedAt?: string;
}
