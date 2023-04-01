interface Role {
  id?: number;
  name?: string;
}

export class RoleEntity {
  roleId?: number;
  userId?: number;
  role?: Role;
}
