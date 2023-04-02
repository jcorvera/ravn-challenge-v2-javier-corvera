import { UserRolesResponseDoc } from './user-roles.response.doc';

export class RoleResponseDoc {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  users?: UserRolesResponseDoc[];
}
