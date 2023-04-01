import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email', example: 'manager-store@gmail.com' })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'Password', example: 'password' })
  password: string;
}
