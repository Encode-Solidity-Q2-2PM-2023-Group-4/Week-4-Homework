import { ApiProperty } from "@nestjs/swagger";

export class MintTokenDTO {
    @ApiProperty({ type: String, required: true, default: "My Address" })
    address: string;
}