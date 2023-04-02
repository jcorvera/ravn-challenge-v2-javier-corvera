import { ApiProperty } from '@nestjs/swagger';
import { UserRolesResponseDoc } from '@users/doc/user-roles.response.doc';
import { Exclude, Expose } from 'class-transformer';

export class AuthResponseDoc {
  @Exclude()
  id?: number;

  @ApiProperty({ example: 'd0f0e0c0-0e0d-4e0c-0e0d-0f0e0d0c0b0a' })
  uuid: string;

  @ApiProperty({ example: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50' })
  profilePicture?: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'uaer@gmail.com' })
  email?: string;

  @ApiProperty({
    example: [
      {
        roleId: 2,
        role: {
          name: 'Manager',
        },
      },
    ],
  })
  roles?: UserRolesResponseDoc[];

  @Expose()
  @ApiProperty({ example: 'SDSDSDSD8SDSDSD...' })
  accessToken?: string;

  @Expose()
  @ApiProperty({ example: 'SDSDSDSD8SDSDSD...' })
  refreshToken?: string;
}
