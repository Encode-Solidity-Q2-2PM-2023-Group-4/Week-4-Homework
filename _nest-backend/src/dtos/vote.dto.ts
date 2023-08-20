import { ApiProperty } from '@nestjs/swagger';

export class voteDto {
  @ApiProperty({ type: String, required: true, default: 'proposalId' })
  proposalId: string;
  @ApiProperty({ type: Number, required: true, default: 'Amouunt to vote with' })
  amount: number;
}