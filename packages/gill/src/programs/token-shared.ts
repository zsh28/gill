import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";

/**
 * Derive the Token Metadata address from a token's Mint address
 *
 * @argument `mint` - `Address` or `KeyPairSigner` of the token Mint
 * @argument `owner` - `Address` or `KeyPairSigner` of the owner's wallet address
 * @argument `tokenProgram` - `Address` of the owner's wallet address
 *
 * @summary
 * Commonly used token programs:
 * - `TOKEN_PROGRAM_ADDRESS` for the original SPL Token Program
 * - `TOKEN_2022_PROGRAM_ADDRESS` for the SPL Token Extension Program (aka Token22)
 */
export async function getTokenAccountAddress(
  mint: Address | KeyPairSigner,
  owner: Address | KeyPairSigner,
  tokenProgram?: Address,
): Promise<Address> {
  return (
    await findAssociatedTokenPda({
      mint: "address" in mint ? mint.address : mint,
      owner: "address" in owner ? owner.address : owner,
      tokenProgram: checkedTokenProgramAddress(tokenProgram),
    })
  )[0];
}

export function assertIsSupportedTokenProgram(
  tokenProgram: Address,
): asserts tokenProgram is Address<typeof tokenProgram> {
  if (tokenProgram !== TOKEN_PROGRAM_ADDRESS && tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS) {
    throw Error(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  }
}

/**
 * Check the provided program is one of the supported token programs.
 * Including setting the default to {@link TOKEN_PROGRAM_ADDRESS} (the original SPL token program)
 *
 * @example
 * ```
 * args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);
 * ```
 */
export function checkedTokenProgramAddress(tokenProgram?: Address): Address {
  if (!tokenProgram) return TOKEN_PROGRAM_ADDRESS;
  assertIsSupportedTokenProgram(tokenProgram);
  return tokenProgram;
}
