import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth.service';
import { Public } from '@common/decorators/public.decorator';
import { Controller, HttpCode, HttpStatus, Post, Body, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignUpDto } from '../dto/sign-up.dto';
import { RefreshTokenGuard } from '../guards';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'Sign Up successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Sign In successfully.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Sign Out successfully.' })
  @ApiUnauthorizedResponse({ description: 'Resource Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
  @ApiBearerAuth()
  signOut(@Request() req): Promise<void> {
    return this.authService.signOut(req.user.id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse({ description: 'Refresh token successfully.' })
  @ApiUnauthorizedResponse({ description: 'Resource Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
  @ApiBearerAuth()
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.email, req.user.refreshToken);
  }
}
