import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, description: 'firstName' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ type: String, description: 'lastName' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'phoneNumber' })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  phoneNumber?: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({ type: String, description: 'city' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  city: string;

  @ApiProperty({ type: String, description: 'address' })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  address: string;

  @ApiProperty({ type: String, description: 'postalCode' })
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(3)
  @MaxLength(10)
  postalCode?: string;
}
