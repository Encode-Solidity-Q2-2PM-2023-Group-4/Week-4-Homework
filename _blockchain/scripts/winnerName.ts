import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as BallotJSON from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
dotenv.config();

function setupProvider(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}
async function main() {
  // sets up provider and wallet/signer from local env file and outputs wallet balance
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance: ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  
  // creating a contract instance from the deployed contract address and relevant abi and signer
  const ballotContract = new ethers.Contract(process.env.BALLOT_ADDRESS ?? "", BallotJSON.abi, signer);

  // finds the index of the winning proposal
  const doWeHaveAWinner = await ballotContract.winningProposal();

  // finds the vote count of the Ethereum proposal
  const proxyEthereum = await ballotContract.proposals(0);
  const proxyEthereumVotes = await proxyEthereum.voteCount;

  // if the winning proposal has an index of 0 (ethereum) and has 0 votes - then there have been no votes and hence no winner
  if (doWeHaveAWinner == 0 && proxyEthereumVotes == 0){
    console.log("No winner");
    return;
  }

  // the length of the proposals[] - can't get directly from contract so it was defined explicitly here
  const numberOfProposals = 8;
  let tied = false;
  let winningIndex = 0;
  let highestVotes = proxyEthereumVotes;
  let tiedProposals = [];

  // for loop printing the name of each proposal and the number of votes each one has
  for (let i = 0; i < numberOfProposals; i++){
    const proposalNum = await ballotContract.proposals(i);
    const proposalNumVotes = await proposalNum.voteCount;
    const proposalNumBytes = await proposalNum.name;
    const proposalNumName = ethers.decodeBytes32String(proposalNumBytes);


    if (highestVotes < proposalNumVotes){
      highestVotes = proposalNumVotes;
      winningIndex = i;
      tiedProposals = [];
      tiedProposals.push(proposalNumName);
      tied = false;

    }

    else if (highestVotes == proposalNumVotes){
      tiedProposals.push(proposalNumName)
      tied = true;
    }

  }

  if (tied == true){
    console.log("The votes are tied between: " + tiedProposals.join(", ") + " each with " + highestVotes + " votes.");
    return;
  }

  const winnerNum = await ballotContract.proposals(winningIndex);
  const winnerNumVotes = await winnerNum.voteCount;
  const winnerNumBytes = await winnerNum.name;
  const winnerNumName = ethers.decodeBytes32String(winnerNumBytes);

  console.log("The winner is " + winnerNumName + " with " + winnerNumVotes + " votes.");

 // LEGACY CODE PLEASE IGNORE
 /* // retreiving the winner name from the contract
  const winnerBytes = await ballotContract.winnerName();

  // converts winner name into human readable string format (previously in bytes32)
  const winnerString = ethers.decodeBytes32String(winnerBytes);

  // outputs the name of the winning proposal
  console.log("Winning proposal: " + winnerString); */

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
