import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class QueryPaginationDto {
  @ApiProperty({ type: Number, description: 'page', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number, description: 'pageSize', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number;
}
