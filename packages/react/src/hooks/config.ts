import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSolanaClient } from "gill";
import { GillConfig } from "../types";
import { GILL_HOOK_KEY_CONFIG } from "../const";

/**
 * Get the current gill config settings (including `rpc` and `rpcSubscriptions`)
 */
export const useGillConfig = () => {
  const { data: config } = useQuery<GillConfig>({
    queryKey: GILL_HOOK_KEY_CONFIG,
    staleTime: Infinity,
    // fallback data should not be reached if used within `GillProvider`
    // since we set the initial value. but just in case => devnet
    initialData: () => {
      return createSolanaClient({
        urlOrMoniker: "devnet",
      });
    },
  });

  return {
    config,
  };
};

/**
 * Update your gill config settings (including `rpc` and `rpcSubscriptions`)
 */
export const useUpdateGillConfig = () => {
  const queryClient = useQueryClient();

  const { mutate: updateGillConfig, ...rest } = useMutation({
    mutationKey: ["updateGillConfig"],
    mutationFn: async (newConfig: GillConfig) => {
      return newConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GILL_HOOK_KEY_CONFIG });
    },
  });

  return {
    updateGillConfig,
    ...rest,
  };
};
