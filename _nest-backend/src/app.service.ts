import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'
import * as ballotJson from './assets/TokenizedBallot.json'
import 'dotenv/config';
require('dotenv').config();

@Injectable()
export class AppService {
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;
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
    this.tokenContract = new ethers.Contract(
      process.env.TOKEN_ADDRESS,
      tokenJson.abi,
      this.wallet,
    );
    this.ballotContract = new ethers.Contract(
      "0xb4e2ae2A947CB41F6e9F941f8269ba0947aa9457",
      ballotJson.abi,
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
    return this.tokenContract.totalSupply();
  }

  getTokenBalance(address: string): Promise<bigint> {
    return this.tokenContract.balanceOf(address);
  }

  async mintTokens(address: string): Promise<any> {
    console.log("Minting tx to " + address);
    const tx = await this.tokenContract.mint(address, ethers.parseUnits("1"));
    const receipt = await tx.wait();
    console.log(receipt);
    return { success: true, txHash: tx.hash };
  }

  async selfDelegate(address: string): Promise<any> {
    console.log("Self-delegating votes...");
    const tx = await this.tokenContract.delegate(address);
    const receipt = await tx.wait();
    console.log(receipt);
    return { success: true, txHash: tx.hash };
  }

  async transferTokens(to: string, value: number): Promise<any> {
    console.log("transfering" + value + "to" + to);

    const txp = {
      to: to,
      value: value
    }

    const tx = await this.wallet.sendTransaction(txp);
    //const tx = await this.wallet.sendTransaction({from, to, value});
    //const contractSigner = this.wallet.connect(this.provider);
    //const tx = await this.contract.connect(contractSigner).send(to, value);

    await tx.wait();
    const receipt = await tx.wait();
    console.log({receipt});
    return {success: true, txHash: '...'};
  }

  async vote(proposalId: string, amount: number): Promise<any> {
    console.log("Voting for proposal" + proposalId);
    const tx =  await this.ballotContract.vote(proposalId, amount);
    const receipt = await tx.wait();
    const proposal_voted = await this.ballotContract.proposals(proposalId);
    console.log({receipt});
    return {success: true, txHash: '...'};
  }
}