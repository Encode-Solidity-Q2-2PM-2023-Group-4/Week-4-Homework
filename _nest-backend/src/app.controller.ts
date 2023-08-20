import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDTO } from './dtos/mintToken.dto';
import { DelegateVotesDTO } from './dtos/selfDelegate.dto';

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

  @Get("token-address")
  getTokenAddress(): any {
    return this.appService.getTokenAddress();
  }

  @Get('total-supply')
  getTotalSupply(): Promise<bigint> {
    return this.appService.getTotalSupply();
  }

  @Get('token-balance/:address')
  getTokenBalance(@Param('address') address: string): any {
    return { balance: this.appService.getTokenBalance(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDTO): Promise<any> {
    console.log({ body });
    return await this.appService.mintTokens(body.address);
  }

  @Post('self-delegate')
  async selfDelegate(@Body() body: DelegateVotesDTO): Promise<any> {
    console.log({ body });
    return await this.appService.selfDelegate(body.address);
  }
}