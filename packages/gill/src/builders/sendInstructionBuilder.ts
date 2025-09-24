// TODO createInstruction().withMemo().withPriorityFee().withComputeLimit().sendSol().sendToken()

import {
  Address,
  Blockhash,
  Instruction,
  Lamports,
  TransactionPartialSigner,
  TransactionSigner,
  TransactionVersion,
} from "@solana/kit";
import { createTransaction } from "../core";
import {
  getAddMemoInstruction,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
  getTransferSolInstruction,
  getTransferTokensInstructions,
  TOKEN_PROGRAM_ADDRESS,
} from "../programs";

interface InstructionBuilder {
  instructions: Instruction[];
  computeUnitLimit?: number;
  computeUnitPrice?: number;
  withMemo: (message: string, signers?: Array<TransactionPartialSigner | TransactionSigner>) => InstructionBuilder;
  withPriorityFee: (microLamports: number) => InstructionBuilder;
  withComputeLimit: (units: number) => InstructionBuilder;
  sendSol: (amount: Lamports, destination: Address, source: TransactionPartialSigner) => InstructionBuilder;
  sendToken: (config: ISendToken) => InstructionBuilder;
  build: (
    feePayer: Address | TransactionPartialSigner | TransactionSigner,
    options?: {
      latestBlockhash?: { blockhash: Blockhash; lastValidBlockHeight: bigint };
      version?: TransactionVersion;
    },
  ) => ReturnType<typeof createTransaction>;
}

interface ISendToken {
  from: TransactionPartialSigner | TransactionSigner;
  to: Address;
  sourceAta: Address;
  destinationAta: Address;
  amount: number | bigint;
  mint: Address;
  authority?: TransactionSigner | Address;
  tokenProgram: Address;
  version?: 0 | "legacy";
}

/**
 *### A builder function that builds on top of the previous ix and returns both instructions ready to be built with `.build()` 

 @example typedef
  interface InstructionBuilder {
  instructions: Instruction[];
  computeUnitLimit?: number;
  computeUnitPrice?: number;
  withMemo: (message: string, signers?: Array<TransactionPartialSigner | TransactionSigner>) => InstructionBuilder;
  withPriorityFee: (microLamports: number) => InstructionBuilder;
  withComputeLimit: (units: number) => InstructionBuilder;
  sendSol: (amount: Lamports, destination: Address, source: TransactionPartialSigner) => InstructionBuilder;
  sendToken: (config: ISendToken) => InstructionBuilder;
  build: (
    feePayer: Address | TransactionPartialSigner | TransactionSigner,
    options?: {
      latestBlockhash?: { blockhash: Blockhash; lastValidBlockHeight: bigint };
      version?: TransactionVersion;
    },
  ) => ReturnType<typeof createTransaction>;
}
 
 * @example 
  let new_ix = createInstruction()
    .withMemo("Hello, this is an ix")
    .sendSol(lamports(lamportsToSend), destinationAddres, kp)
    .sendToken({
      amount: 1_000_000,
      destinationAta,
      sourceAta,
      from: kp,
      mint: tokenMint,
      to: destinationAddres,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    })
    .build(kp, {
      version: "legacy",
    });
 */
export const createInstruction = (): InstructionBuilder => {
  const builder = (
    instructions: Instruction[] = [],
    computeUnitLimit?: number,
    computeUnitPrice?: number,
  ): InstructionBuilder => ({
    instructions,
    computeUnitLimit,
    computeUnitPrice,

    withMemo: (message: string, signers?) => {
      const memoIx = getAddMemoInstruction({ memo: message, signers });
      return builder([...instructions, memoIx]);
    },

    withPriorityFee: (microLamports: number) => {
      const priorityIx = getSetComputeUnitPriceInstruction({ microLamports });
      return builder([...instructions, priorityIx]);
    },

    withComputeLimit: (units: number) => {
      const computeIx = getSetComputeUnitLimitInstruction({ units });
      return builder([...instructions, computeIx]);
    },

    sendSol: (amount, destination, source) => {
      const transferIx = getTransferSolInstruction({ amount, destination, source });
      return builder([...instructions, transferIx]);
    },

    sendToken: (config: ISendToken) => {
      const tokenIx = getTransferTokensInstructions({
        feePayer: config.from,
        mint: config.mint,
        amount: config.amount,
        authority: config.from,
        sourceAta: config.sourceAta,
        destination: config.to,
        destinationAta: config.destinationAta,
        tokenProgram: config.tokenProgram ? config.tokenProgram : TOKEN_PROGRAM_ADDRESS,
      });

      return builder([...instructions, ...tokenIx]);
    },

    build: (feePayer, options?) => {
      return createTransaction({
        instructions,
        feePayer,
        latestBlockhash: options?.latestBlockhash,
        computeUnitLimit,
        computeUnitPrice,
        version: options?.version,
      });
    },
  });

  return builder();
};
