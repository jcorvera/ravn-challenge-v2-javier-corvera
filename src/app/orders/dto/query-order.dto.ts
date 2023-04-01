import { QueryPaginationDto } from '@common/dto/query-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryOrderDto extends QueryPaginationDto {
  @ApiProperty({ type: String, description: 'customerUuid', required: false })
  @IsOptional()
  @IsUUID()
  customerUuid: string;
}
