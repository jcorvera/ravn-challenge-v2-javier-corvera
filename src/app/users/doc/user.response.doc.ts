import { UserRolesResponseDoc } from './user-roles.response.doc';
import { UserAddressResponseDoc } from './user.address.response-doc';

export class UserResponseDoc {
  id?: number;
  uuid: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  hashRefreshToken?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: UserRolesResponseDoc[];
  address?: UserAddressResponseDoc;
}
