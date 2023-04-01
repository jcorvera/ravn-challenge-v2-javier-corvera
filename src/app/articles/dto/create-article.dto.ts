import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @ApiProperty({ type: String, description: 'title', example: 'Article title' })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  title: string;

  @ApiPropertyOptional()
  @ApiProperty({ type: String, description: 'description', example: 'Article description' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: Number, description: 'price', example: 12.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999)
  price: number;

  @ApiPropertyOptional()
  @ApiProperty({ type: Boolean, description: 'published', example: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ type: Number, description: 'quantity', required: false, example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: Number, description: 'categoryId', example: 1 })
  @IsNumber()
  @Min(1)
  categoryId: number;
}
