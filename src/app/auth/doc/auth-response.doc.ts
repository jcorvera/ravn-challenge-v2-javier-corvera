import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@app/users/doc/role.response';

export class AuthResponseDoc {
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

  @ApiProperty({ example: '' })
  roles?: RoleEntity[];

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
  accessToken?: string;

  @ApiProperty({ example: 'SDSDSDSD8SDSDSD...' })
  refreshToken?: string;
}
