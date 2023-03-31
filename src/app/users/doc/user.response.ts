import { RoleEntity } from './role.response';

export class UserEntity {
  id?: number;
  uuid: string;
  profilePicture?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string | null;
  password?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: RoleEntity[];
  hashRefreshToken?: string;
}
