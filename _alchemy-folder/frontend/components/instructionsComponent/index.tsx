import styles from "./instructionsComponent.module.css";
import { useAccount, useNetwork, useBalance, useWalletClient, useSignMessage, useSendTransaction, usePrepareSendTransaction, useConnect, useContractRead } from 'wagmi';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();};

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>VotePro</h1>
        </div>
      </header>
      <p className={styles.get_started}>
        <PageBody></PageBody>
      </p>
    </div>
  );
}

function PageBody() {
  return (
    <div>
      <TokenName></TokenName>
      <TokenAddressFromApi></TokenAddressFromApi>
      <TransferTokens></TransferTokens>
      <VoteWithToken></VoteWithToken>
      <WalletInfo></WalletInfo>
    </div>
  )
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletBalance address={address}></WalletBalance>
        <TokenBalance address={address}></TokenBalance>
        <ReuqestTokensToBeMinted address={address}></ReuqestTokensToBeMinted>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
          signMessage({
            message: signatureMessage,
          })
        }
      >
        Sign message
      </button>
      {isSuccess && <div> SUCCESS, Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}


function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x28ee359f1Cee296a0813e35e8c61d16fA4F5388e",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0x28ee359f1Cee296a0813e35e8c61d16fA4F5388e",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ address: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.address}</p>
    </div>
  );
}

function ReuqestTokensToBeMinted(params: {address: `0x${string}`}) {
  const [data, setData] = useState<{ address: string }>();
  const [isLoading, setLoading] = useState(false);
  const body = {address:params.address}

  if (isLoading) return <p>Requesting tokens from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({address: params.address})
  };

  if (!data) return (
    <button
      disabled={isLoading}
      onClick={() => {
        setLoading(true);
        fetch("http://localhost:3001/mint-tokens", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
          setLoading(false);
          });
      }}
    >
    Request tokens
  </button>);

return (
  <div>
    <p>Mint Result: {data.success ? 'Success' : 'Failure'}</p>
    <p>Mint Tx Hash: {data.txHash}</p>
  </div>
);
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
}