import type {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  DevnetUrl,
  MainnetUrl,
  TestnetUrl,
} from "@solana/web3.js";

/** Solana cluster moniker */
export type SolanaClusterMoniker =
  | "mainnet-beta"
  | "devnet"
  | "testnet"
  | "localnet";

type GenericUrl = string & {};

export type ModifiedClusterUrl =
  | DevnetUrl
  | MainnetUrl
  | TestnetUrl
  | GenericUrl;

export type SolanaUrlOrMoniker = SolanaClusterMoniker | ModifiedClusterUrl;

export type CreateSolanaClientArgs = {
  /** Full RPC URL (for a private RPC endpoint) or the Solana moniker (for a public RPC endpoint) */
  urlOrMoniker: URL | SolanaUrlOrMoniker;
  /** Configuration used to create the `rpc` client */
  rpcConfig?: Parameters<typeof createSolanaRpc>[1];
  /** Configuration used to create the `rpcSubscriptions` client */
  rpcSubscriptionsConfig?: Parameters<typeof createSolanaRpcSubscriptions>[1];
};

export type CreateSolanaClientResult = {
  /** Newly created Solana RPC client  */
  rpc: ReturnType<typeof createSolanaRpc>;
  /** Newly created Solana RPC subscriptions client */
  rpcSubscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;
};
