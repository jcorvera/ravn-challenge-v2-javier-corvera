import { QueryPaginationDto } from '@common/dto/query-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min, IsNumber } from 'class-validator';

export class QueryArticleDto extends QueryPaginationDto {
  @ApiProperty({ type: Number, description: 'categoryId', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId: number;

  published?: boolean;
}
