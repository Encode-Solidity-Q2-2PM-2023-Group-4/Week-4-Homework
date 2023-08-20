import { ApiProperty } from "@nestjs/swagger";

export class DelegateVotesDTO {
    @ApiProperty({ type: String, required: true, default: "My Address" })
    address: string;
}