import { getTransferSolInstruction } from "@solana-program/system";
import { Address, Lamports, TransactionPartialSigner, TransactionSigner } from "@solana/kit";
import { createTransaction } from "../core";

interface ITransfer {
  from: TransactionPartialSigner | TransactionSigner;
  to: Address;
  lamports: Lamports;
  version?: 0 | "legacy";
}

/**
 * @example
 * let amount = lamports(1_000_000_000n);
 * let from = await generateExtractableKeyPairSigner();
 * let to: Address;
 * let transferSolIx = transferSol({from, to, amount});
 * 
 * const transfer = await sendAndConfirmTransaction(transferSolIx);

console.log(
  "Explorer transfer:",
  getExplorerLink({
    cluster: "devnet",
    transaction: transfer,
  })
);
 */
const transferSol = ({ from, to, lamports, version }: ITransfer) => {
  const transferInstruction = getTransferSolInstruction({
    amount: lamports,
    destination: to,
    source: from,
  });

  let transferTransaction = createTransaction({
    feePayer: from,
    instructions: [transferInstruction],
    version: version || "legacy",
  });

  return transferTransaction;
};

export default transferSol;
