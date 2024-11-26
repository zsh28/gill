import type { SolanaUrlOrMoniker } from "./rpc";

type ExplorerLinkAccount = {
  address: string;
};
type ExplorerLinkTransaction = {
  transaction: string;
};
type ExplorerLinkBlock = {
  block: string;
};

/**
 * @param cluster - Default: `mainnet-beta`
 */
export type GetExplorerLinkArgs = {
  cluster?: SolanaUrlOrMoniker;
} & (ExplorerLinkAccount | ExplorerLinkTransaction | ExplorerLinkBlock);
