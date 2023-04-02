import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';
import { UserResponseDoc } from '../doc/user.response.doc';

@Roles(Role.Manager)
@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiTags('Customers')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customers')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findAll(): Promise<UserResponseDoc[]> {
    return this.usersService.findAllCustomers();
  }
}
