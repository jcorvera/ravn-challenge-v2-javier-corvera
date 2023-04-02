import { UserResponseDoc } from './user.response.doc';

export class UserAddressResponseDoc {
  id?: number;
  city?: string;
  address?: string;
  postalCode?: string;
  user?: UserResponseDoc;
  userId?: number;
}
