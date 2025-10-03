"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetTransactionApi, Signature, Simplify } from "gill";

import { GILL_HOOK_CLIENT_KEY } from "../const.js";
import { useSolanaClient } from "./client.js";
import type { GillUseRpcHook } from "./types.js";

type RpcConfig = Simplify<Parameters<GetTransactionApi["getTransaction"]>[1]>;

type UseTransactionResponse = ReturnType<GetTransactionApi["getTransaction"]>;

type UseTransactionInput<TConfig extends RpcConfig = RpcConfig> = GillUseRpcHook<TConfig> & {
  /**
   * Transaction signature as a base-58 encoded string
   */
  signature: Signature | string;
};

/**
 * Get transaction details for a confirmed transaction using the Solana RPC method of
 * [`getTransaction`](https://solana.com/docs/rpc/http/gettransaction)
 *
 * Default `config` includes:
 * - `maxSupportedTransactionVersion` of `0`
 * - `encoding` of `json`
 */
export function useTransaction<TConfig extends RpcConfig = RpcConfig>({
  options,
  config,
  abortSignal,
  signature,
}: UseTransactionInput<TConfig>) {
  const { rpc, urlOrMoniker } = useSolanaClient();
  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    enabled: (options?.enabled ?? true) && !!signature,
    queryFn: async () => {
      const response = await rpc
        .getTransaction(signature as Signature, {
          encoding: "json",
          // set default values for better DX
          maxSupportedTransactionVersion: 0,
          ...(config || {}),
        })
        .send({ abortSignal });
      return response;
    },
    queryKey: [GILL_HOOK_CLIENT_KEY, urlOrMoniker, "getTransaction", signature],
  });
  return {
    ...rest,
    transaction: data as UseTransactionResponse,
  };
}
