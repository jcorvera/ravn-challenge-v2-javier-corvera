import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@app/users/doc/user.response';
import { SignUpDto } from '@auth/dto/sign-up.dto';
import { Role } from '@app/common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<UserEntity> {
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

  async create(signUpDto: SignUpDto) {
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

  async exists(email: string) {
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
}
