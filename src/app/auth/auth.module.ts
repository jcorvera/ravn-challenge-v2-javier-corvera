import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthController } from './controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@app/prisma/prisma.module';
import { RefreshTokenJWTStrategy, AccessTokenJWTStrategy } from './strategies';
import { AuthGuard, RolesGuard } from './guards';
import { AuthService, TokensService } from './services';

@Module({
  imports: [JwtModule.register({}), PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    TokensService,
    AccessTokenJWTStrategy,
    RefreshTokenJWTStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
