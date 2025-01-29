import { pipe } from "@solana/functional";
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/transaction-messages";
import { isTransactionSigner, setTransactionMessageFeePayerSigner } from "@solana/signers";
import type { CreateTransactionInput } from "../types/transactions";

/**
 * Simple interface for creating a Solana transaction
 */
export function createTransaction({
  version,
  feePayer,
  instructions,
  latestBlockhash,
}: CreateTransactionInput) {
  return pipe(
    createTransactionMessage({ version }),
    (tx) => {
      if (latestBlockhash) {
        tx = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx);
      }
      if (typeof feePayer !== "string" && "address" in feePayer && isTransactionSigner(feePayer)) {
        return setTransactionMessageFeePayerSigner(feePayer, tx);
      } else return setTransactionMessageFeePayer(feePayer, tx);
    },
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );
}
