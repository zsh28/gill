import type {
  Address,
  TransactionMessageWithBlockhashLifetime,
  TransactionMessageWithFeePayer,
  TransactionMessageWithFeePayerSigner,
  TransactionSigner,
  TransactionVersion,
} from "@solana/kit";
import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  isTransactionSigner,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget";

import type { Simplify } from "../types";
import type { CreateTransactionInput, FullTransaction } from "../types/transactions";

/**
 * Simple interface for creating a Solana transaction
 */
export function createTransaction<TVersion extends TransactionVersion, TFeePayer extends TransactionSigner>(
  props: CreateTransactionInput<TVersion, TFeePayer>,
): FullTransaction<TVersion, TransactionMessageWithFeePayerSigner>;
export function createTransaction<TVersion extends TransactionVersion, TFeePayer extends Address>(
  props: CreateTransactionInput<TVersion, TFeePayer>,
): FullTransaction<TVersion, TransactionMessageWithFeePayer>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
): Simplify<FullTransaction<TVersion, TransactionMessageWithFeePayerSigner, TransactionMessageWithBlockhashLifetime>>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends Address,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
): Simplify<FullTransaction<TVersion, TransactionMessageWithFeePayer, TransactionMessageWithBlockhashLifetime>>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends Address | TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
): Simplify<FullTransaction<TVersion, TransactionMessageWithFeePayer, TransactionMessageWithBlockhashLifetime>>;
export function createTransaction<TVersion extends TransactionVersion, TFeePayer extends Address | TransactionSigner>({
  version,
  feePayer,
  instructions,
  latestBlockhash,
  computeUnitLimit,
  computeUnitPrice,
}: CreateTransactionInput<TVersion, TFeePayer>): FullTransaction<
  TVersion,
  TransactionMessageWithFeePayer | TransactionMessageWithFeePayerSigner
> {
  return pipe(
    // Auto-select version: if any provided instruction appears to use an Address Lookup Table (ALT),
    // choose `v0`. Otherwise default to `legacy`. If the caller explicitly provides `version`, use it.
    (() => {
      const selectedVersion =
        version ??
        ((instructions.some(
          (ix) =>
            ("addressTableLookup" in ix && ix.addressTableLookup != null) ||
            ("addressTableLookups" in ix && Array.isArray(ix.addressTableLookups) && ix.addressTableLookups.length > 0),
        )
          ? "v0"
          : "legacy") as TVersion);
      return createTransactionMessage({ version: selectedVersion });
    })(),
    (tx) => {
      const withLifetime = latestBlockhash ? setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx) : tx;
      if (typeof feePayer !== "string" && "address" in feePayer && isTransactionSigner(feePayer)) {
        return setTransactionMessageFeePayerSigner(feePayer, withLifetime);
      } else return setTransactionMessageFeePayer(feePayer, withLifetime);
    },
    (tx) => {
      const withComputeLimit =
        typeof computeUnitLimit !== "undefined"
          ? appendTransactionMessageInstruction(
              getSetComputeUnitLimitInstruction({ units: Number(computeUnitLimit) }),
              tx,
            )
          : tx;

      const withComputePrice =
        typeof computeUnitPrice !== "undefined"
          ? appendTransactionMessageInstruction(
              getSetComputeUnitPriceInstruction({ microLamports: Number(computeUnitPrice) }),
              withComputeLimit,
            )
          : withComputeLimit;

      return appendTransactionMessageInstructions(instructions, withComputePrice);
    },
  );
}
