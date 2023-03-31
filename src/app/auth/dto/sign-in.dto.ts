import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
