import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserResponseDoc } from '@users/doc/user.response.doc';
import { SignUpDto } from '@auth/dto/sign-up.dto';
import { Role } from '@app/common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<UserResponseDoc> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        uuid: true,
        profilePicture: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        isActive: true,
        hashRefreshToken: true,
        roles: {
          select: {
            roleId: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async finOneByRole(roleId: number, userId: number): Promise<string | never> {
    const result = await this.prisma.userRoles.findUnique({
      where: {
        userId_roleId: { userId, roleId },
      },
      select: { role: true },
    });

    if (result) {
      return result.role.name;
    }

    throw new UnauthorizedException();
  }

  async create(signUpDto: SignUpDto): Promise<UserResponseDoc | never> {
    try {
      const role = await this.prisma.role.findFirst({ where: { name: Role.Client } });
      const { firstName, lastName, email, password } = signUpDto;

      return this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber: signUpDto.phoneNumber ?? null,
          password,
          address: {
            create: {
              city: signUpDto.city,
              address: signUpDto.address,
              postalCode: signUpDto.postalCode ?? null,
            },
          },
          roles: {
            create: [
              {
                roleId: role.id,
              },
            ],
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async exists(email: string): Promise<UserResponseDoc | never> {
    try {
      return this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateHashRefreshToken(userId: number, hashRefreshToken: string): Promise<number | void> {
    try {
      if (hashRefreshToken === null) {
        const result = await this.prisma.user.updateMany({
          where: { id: userId, hashRefreshToken: { not: null } },
          data: { hashRefreshToken: null },
        });

        return result.count;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { hashRefreshToken: hashRefreshToken },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAllCustomers(): Promise<UserResponseDoc[]> {
    return this.prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: Role.Client,
            },
          },
        },
      },
      select: {
        uuid: true,
        profilePicture: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
