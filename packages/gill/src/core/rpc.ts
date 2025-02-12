import { devnet, mainnet, testnet } from "@solana/rpc-types";

import { LocalnetUrl, ModifiedClusterUrl, SolanaClusterMoniker } from "../types/rpc";

export function localnet(putativeString: string): LocalnetUrl {
  return putativeString as LocalnetUrl;
}

/**
 * Get a public Solana RPC endpoint for a cluster based on its moniker
 *
 * Note: These RPC URLs are rate limited and not suitable for production applications.
 */
export function getPublicSolanaRpcUrl(
  cluster: SolanaClusterMoniker | "mainnet-beta",
): ModifiedClusterUrl {
  switch (cluster) {
    case "devnet":
      return devnet("https://api.devnet.solana.com");
    case "testnet":
      return testnet("https://api.testnet.solana.com");
    case "mainnet-beta":
    case "mainnet":
      return mainnet("https://api.mainnet-beta.solana.com");
    case "localnet":
      return localnet("http://127.0.0.1:8899");
    default:
      throw new Error("Invalid cluster moniker");
  }
}
