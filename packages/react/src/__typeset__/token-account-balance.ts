import { Address, GetTokenAccountBalanceApi } from "gill";
import { useTokenAccountBalance } from "../hooks/token-account-balance.js";

// [DESCRIBE] useTokenAccountBalance
{
  {
    const { balance } = useTokenAccountBalance({ address: "123" as Address });
    balance satisfies ReturnType<GetTokenAccountBalanceApi["getTokenAccountBalance"]>;
  }

  {
    const { balance } = useTokenAccountBalance({
      address: "123" as Address,
      options: {
        refetchInterval: 500,
      },
    });
    balance satisfies ReturnType<GetTokenAccountBalanceApi["getTokenAccountBalance"]>;
  }

  {
    const { balance } = useTokenAccountBalance({
      address: "123" as Address,
      config: {
        commitment: "confirmed",
      },
      abortSignal: new AbortController().signal,
    });
    balance satisfies ReturnType<GetTokenAccountBalanceApi["getTokenAccountBalance"]>;
  }
}
