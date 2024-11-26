import assert from "node:assert";
import { describe, test } from "node:test";
import { getExplorerLink } from "../src/index";

describe("getExplorerLink", () => {
  test("getExplorerLink works for a block on mainnet when no network is supplied", () => {
    const link = getExplorerLink({
      block: "242233124",
    }).toString();
    assert.equal(link, "https://explorer.solana.com/block/242233124");
  });

  test("getExplorerLink works for a block on mainnet", () => {
    const link = getExplorerLink({
      cluster: "mainnet-beta",
      block: "242233124",
    }).toString();
    assert.equal(link, "https://explorer.solana.com/block/242233124");
  });

  test("getExplorerLink works for an address on mainnet", () => {
    const link = getExplorerLink({
      cluster: "mainnet-beta",
      address: "dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8",
    }).toString();
    assert.equal(
      link,
      "https://explorer.solana.com/address/dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8",
    );
  });

  test("getExplorerLink works for an address on devnet", () => {
    const link = getExplorerLink({
      cluster: "devnet",
      address: "dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8",
    }).toString();
    assert.equal(
      link,
      "https://explorer.solana.com/address/dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8?cluster=devnet",
    );
  });

  test("getExplorerLink works for a transaction on devnet", () => {
    const link = getExplorerLink({
      cluster: "devnet",
      transaction:
        "4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg",
    }).toString();
    assert.equal(
      link,
      "https://explorer.solana.com/tx/4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg?cluster=devnet",
    );
  });

  test("getExplorerLink provides a localnet URL", () => {
    const link = getExplorerLink({
      cluster: "localnet",
      transaction:
        "2QC8BkDVZgaPHUXG9HuPw7aE5d6kN5DTRXLe2inT1NzurkYTCFhraSEo883CPNe18BZ2peJC1x1nojZ5Jmhs94pL",
    }).toString();
    assert.equal(
      link,
      "https://explorer.solana.com/tx/2QC8BkDVZgaPHUXG9HuPw7aE5d6kN5DTRXLe2inT1NzurkYTCFhraSEo883CPNe18BZ2peJC1x1nojZ5Jmhs94pL?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899",
    );
  });
});
