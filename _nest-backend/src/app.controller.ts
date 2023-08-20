import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
import { TransferTokensDto } from './dtos/transferToken.dto';
import { voteDto } from './dtos/vote.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("another-thing")
  getAnotherThing(): string {
    return this.appService.getAnotherThing();
  }

  @Get("total-supply")
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('contract-address')
  getContractAddress(): any {
    return this.appService.getContractAddress();
  }

  @Get("token-balance/:address")
  getTokenBalance(@Param('address') address: string) {
    return this.appService.getTokenBalance(address);
  }

  @Post("mint-tokens")
  async mintTokens(@Body() body:MintTokenDto){
    console.log({ body })
    const result = await this.appService.mintTokens(body.address);
    return result
  }

  @Post("transfer-tokens")
  async transferTokens(@Body() body:TransferTokensDto){
    console.log({ body })
    const result = await this.appService.transferTokens(body.to, body.value);
    return result
  }

  @Post("vote")
  async vote(@Body() body:voteDto){
    console.log({ body })
    const result = await this.appService.vote(body.proposalId, body.amount);
    return result
  }
}
