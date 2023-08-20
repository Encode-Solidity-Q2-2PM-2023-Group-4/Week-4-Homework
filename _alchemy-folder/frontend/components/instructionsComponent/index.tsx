import { useAccount, useBalance, useContractRead, useNetwork, usePrepareSendTransaction, useSendTransaction } from "wagmi";
import styles from "./instructionsComponent.module.css";
import { useState } from "react";
import tokenJson from '../../../../_nest-backend/src/assets/MyToken.json';
import ballotJson from '../../../../_blockchain/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';
import 'dotenv/config';
require('dotenv').config();

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Web3<span> Voting dApp</span>
          </h1>
          <h3>The Encode Club's Solidity Bootcamp fourth week homework</h3>
          <p>Completed by Nanda Girish, Antony Siahaan, Adam Czopp and Linus Kelsey.</p>
        </div>
      </header>
      <WalletInfo></WalletInfo>
      <TransferTokens></TransferTokens>
      <VoteWithToken></VoteWithToken>
      <PageBody></PageBody>
    </div>
  );
}

function PageBody() {
  const { address } = useAccount();

  return (
    <div className={styles.buttons_container}>
      <DelegateVote address={address}></DelegateVote>
      <PlaceVote></PlaceVote>
      <SeeCurrentVotes></SeeCurrentVotes>
      <MintTokens address={address}></MintTokens>
    </div>
  )
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is <b>{address}</b>.</p>
        <p>Connected to the <b>{chain?.name}</b> network.</p>
        <WalletBalance address={address}></WalletBalance>
        <TokenName></TokenName>
        <TokenBalance address={address}></TokenBalance>
        <SeeVotingPower address={address}></SeeVotingPower>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Connecting wallet...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue.</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue.</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <p>Fetching balance…</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return (
    <div>
      <p>Balance: <b>{data?.formatted} {data?.symbol}</b></p>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x28ee359f1Cee296a0813e35e8c61d16fA4F5388e",
    abi: tokenJson.abi,
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <p>Fetching name…</p>;
  if (isError) return <p>Error fetching name.</p>;
  return <p>Token name: <b>{name}</b></p>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0x28ee359f1Cee296a0813e35e8c61d16fA4F5388e",
    abi: tokenJson.abi,
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "bigint" ? data : 0;

  if (isLoading) return <p>Fetching balance...</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return <p>Token balance: <b>{Number(balance)}</b> decimal units of <b>VoteToken2</b>.</p>;
}

function SeeVotingPower(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0xf000ef058FF6851b12Ff35F5176BF4Ef46f2f7B9",
    abi: ballotJson.abi,
    functionName: "votingPower",
    args: [params.address],
  });

  const votePower = typeof data === "bigint" ? data : 0;

  if (isLoading) return <p>Fetching voting power...</p>
  if (isError) return <p>Error fetching voting power.</p>
  return <p>Voting power: <b>{Number(votePower)}</b></p>
}

function DelegateVote(params: { address: `0x${string}` | undefined }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ address: params.address })
  };

  if (isLoading) return (
    <div className={styles.button}>
      Delegating votes with API...
    </div>
  )

  if (!data) return <p>
    <button
        disabled={isLoading}
        className={styles.button}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/self-delegate", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false)
          });
        }}
    >
      Delegate Votes
    </button>
  </p>;

  const hash = String(data.txHash);
  const ETHScanLink = "https://sepolia.etherscan.io/tx/" + hash;
  const shortHash = hash.slice(0,5) + "..." + hash.slice(-3)

  return (
    <div className={styles.buttonTXConf}>
      Tx hash: <a href={ETHScanLink}
        target="_blank"
        rel="noreferrer noopener"
      >
        {shortHash}
      </a>
    </div>
  )
}

function PlaceVote() {
  return (
    <button className={styles.button}>
      <p>Place Vote</p>
    </button>
  )
}

function SeeCurrentVotes() {
  return (
    <button className={styles.button}>
      <p>See Current Votes</p>
    </button>
  )
}

function MintTokens(params: { address: `0x${string}` | undefined }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ address: params.address })
  };

  if (isLoading) return (
    <div className={styles.button}>
      Requesting tokens from API...
    </div>
  )

  if (!data) return <p>
    <button
        disabled={isLoading}
        className={styles.button}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false)
          });
        }}
    >
      Request Tokens
    </button>
  </p>;

  const hash = String(data.txHash);
  const ETHScanLink = "https://sepolia.etherscan.io/tx/" + hash;
  const shortHash = hash.slice(0,5) + "..." + hash.slice(-3)

  return (
    <div className={styles.buttonTXConf}>
      Tx hash: <a href={ETHScanLink}
        target="_blank"
        rel="noreferrer noopener"
      >
        {shortHash}
      </a>
    </div>
  )
}

function TransferTokens() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config)
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");


  if (isLoading) return <p>Requesting transfer from API...</p>;

      const objStr = {
        to: to,
        value: value,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objStr)
      };


  if (!data) return (
    <><div>
      <form>
        <label>
          Enter 'to' address':
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)} />
        </label>
      </form>
      <form>
        <label>
          Enter amount of tokens to transfer:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)} />
        </label>
      </form>
    </div><div>
        <button
          //disabled={isLoading} 
          onClick={() => fetch("http://localhost:3001/transfer-tokens", requestOptions)}>

          Send Tokens

        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div></>
    )
    return <></>
}


function VoteWithToken() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config)
  const [proposalId, setProposalId] = useState("");
  const [amount, setAmount] = useState("");


  if (isLoading) return <p>Requesting transfer from API...</p>;

      const objStr = {
        proposalId: proposalId,
        amount: amount,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objStr)
      };


  if (!data) return (
    <><div>
      <form>
        <label>
          Enter proposal id:
          <input
            type="text"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)} />
        </label>
      </form>
      <form>
        <label>
          Enter amount of tokens to vote with:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </label>
      </form>
    </div><div>
        <button
          //disabled={isLoading} 
          onClick={() => fetch("http://localhost:3001/vote", requestOptions)}>

          Vote Now

        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div></>
    )
    return <></>
}