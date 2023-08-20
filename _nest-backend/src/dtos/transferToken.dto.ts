import { ApiProperty } from '@nestjs/swagger';

export class TransferTokensDto {
  @ApiProperty({ type: String, required: true, default: 'Destination address' })
  to: string;
  @ApiProperty({ type: Number, required: true, default: 'Amount to transfer' })
  value: number;
}