import { UsersService } from '@users/services/users.service';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDoc } from '../doc/auth-response.doc';
import { compare } from 'bcrypt';
import { SignUpDto } from '../dto/sign-up.dto';
import { TokensService } from './tokens.service';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private tokensService: TokensService) {}

  async updateRefreshToken(userId: number, refreshToken?: string): Promise<void> {
    const hash = await this.tokensService.hashData(refreshToken);
    await this.usersService.updateHashRefreshToken(userId, hash);
  }

  async signUp(signUpDto: SignUpDto) {
    const userAlredyExist = await this.usersService.exists(signUpDto.email);

    if (userAlredyExist) {
      throw new ConflictException('User already exist');
    }

    signUpDto.password = await this.tokensService.hashData(signUpDto.password);
    const user = await this.usersService.create(signUpDto);
    const tokens = await this.tokensService.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDoc> {
    const user = await this.usersService.findOne(signInDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const passworMattches = await compare(signInDto.password, user.password);
    if (!passworMattches) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokensService.getTokens({
      id: user.id,
      uuid: user.uuid,
      profilePicture: user.profilePicture,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signOut(userId: number): Promise<void | never> {
    const result = await this.usersService.updateHashRefreshToken(userId, null);
    if (!result) {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(email: string, refreshToken: string): Promise<AuthResponseDoc> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokenMattches = await compare(refreshToken, user.hashRefreshToken);
    if (!tokenMattches || !user.isActive) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokensService.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
