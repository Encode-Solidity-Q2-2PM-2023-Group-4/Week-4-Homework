import { ethers } from "ethers";
import * as BallotJSON from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json"
import * as dotenv from 'dotenv';
dotenv.config();

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() {
  // the contract address needs to be hard-coded or inlcuded as the third argument in the comman line  
  const ballot_contract_address = process.env.BALLOT_ADDRESS ?? "";
  // proposal index is the first argument in the command line 
  const proposal_id = process.argv[2];
  // the voting power to spend is the second argument in the command line 
  const amount = Number(process.argv[3])
  
  if (amount < 0) {
    throw new Error("Casting a negative vote. Do not decrease the vote count !")
  }
  
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`\nWallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether")
  }

  const ballotContract = new ethers.Contract(ballot_contract_address, BallotJSON.abi, signer);
  
  // call the Solidity's vote function
  await ballotContract.vote(proposal_id, amount);

  const proposal_voted = await ballotContract.proposals(proposal_id);
  console.log(`\nUpdated total vote for ${proposal_voted.name} = ${await proposal_voted.voteCount}.`);
  console.log(`Wallet balance ${balance}\n`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

