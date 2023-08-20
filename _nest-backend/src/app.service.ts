import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'
import 'dotenv/config';
require('dotenv').config();

@Injectable()
export class AppService {
  contract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? '',
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY ?? '', 
      this.provider,
    );
    this.contract = new ethers.Contract(
      process.env.TOKEN_ADDRESS,
      tokenJson.abi,
      this.wallet,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
  
  getAnotherThing(): string {
    return 'Another thing!';
  }

  getTokenAddress(): any {
    return { address: process.env.TOKEN_ADDRESS };
  }
  
  getTotalSupply(): Promise<bigint> {
    return this.contract.totalSupply();
  }

  getTokenBalance(address: string): Promise<bigint> {
    return this.contract.balanceOf(address);
  }

  async mintTokens(address: string): Promise<any> {
    console.log("Minting tx to " + address)
    const tx = await this.contract.mint(address, ethers.parseUnits("1"));
    const receipt = await tx.wait();
    console.log(receipt);
    return { success: true, txHash: tx.hash };
  }
}