import { ArrayNotEmpty, IsEnum, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';
import { PaymentType } from '@common/enums/payment-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderDetailDto {
  @ApiProperty({ type: String, description: 'productUuid' })
  @IsUUID()
  productUuid: string;

  @ApiProperty({ type: Number, description: 'quantity' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType, {
    message: 'Sort must has any of these values:   Finished, Started or Stateless',
  })
  paymentType: PaymentType;

  @ApiProperty({ isArray: true, type: OrderDetailDto })
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => OrderDetailDto)
  orderDetail: OrderDetailDto[];
}
