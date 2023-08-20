import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json'
import * as dotenv from "dotenv";
import * as BallotJSON from "./assets/TokenizedBallot.json"
dotenv.config();

const CONTRACT_ADDRESS = "0x28ee359f1Cee296a0813e35e8c61d16fA4F5388e";
const BALLOT_ADDRESS="0xa09b745Da6FF0E5E8AC4B79B4F14870af19aE843";

@Injectable()
export class AppService {
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  //signer: ethers.Signer;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '',);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider);
    this.tokenContract = new ethers.Contract(CONTRACT_ADDRESS, tokenJson.abi, this.wallet);
    this.ballotContract = new ethers.Contract(BALLOT_ADDRESS, BallotJSON.abi, this.wallet);
    //this.signer = this.wallet.connect(this.provider);
    }

    getHello(): string {
      return 'Hello World!';
    }

    getAnotherThing(): string {
      return 'ANOTHER!';
    }

    getContractAddress(): any {
      return { address: CONTRACT_ADDRESS };
    }

    getTotalSupply() {
      return this.tokenContract.totalSupply();
    }
    
    getTokenBalance(address: string) {
      return this.tokenContract.balanceOf(address);
    }

    async mintTokens(address: string): Promise<any> {
      console.log("Minting tx" + address);
      const tx = await this.tokenContract.mint(address, ethers.parseUnits("10000000000000"));
      const receipt = await tx.wait();
      console.log({receipt});
      return {success: true, txHash: '...'};
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