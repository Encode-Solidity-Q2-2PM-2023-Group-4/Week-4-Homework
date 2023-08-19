import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import * as BallotJSON from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
dotenv.config();

const MINT_VALUE = ethers.parseUnits("1");

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() {
  
  // Define provider and wallet
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);

  // Attach
  const ballotContract = new ethers.Contract(process.env.BALLOT_ADDRESS ?? "", BallotJSON.abi, signer);
  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(process.env.VOTING_TOKEN_ADDRESS ?? "") as MyToken;

  // Check the voting power
  const votes = await ballotContract.votingPower(signer.address);
  console.log(`Account ${signer.address} has ${votes.toString()} units of voting power.\n`);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});