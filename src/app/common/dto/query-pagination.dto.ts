import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class QueryPaginationDto {
  @ApiProperty({ type: Number, description: 'page' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number, description: 'pageSize' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number;
}
