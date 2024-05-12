import { useState } from "react";
import { WalletContextState, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "../anchor/setup";
import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
 
export default async function Initialize(
    wallet: WalletContextState,
    connection: Connection,
    feeWallet: PublicKey,
    feePercent: number
) {
  
 
  if (!wallet.publicKey) return;
 
    try {
      // Create a transaction to invoke the increment function
      const transaction = await program.methods
        .initialize({
            feeWallet: feeWallet,
            feePercent: feePercent
        })
        .accounts({
            authority: wallet.publicKey,
            launchpad: launchpadPda,
        })
        .transaction();
 
      const transactionSignature = await wallet.sendTransaction(
        transaction,
        connection,
      );
 
      console.log(
        `initialize tx id: ${transactionSignature}`,
      );
    } catch (error) {
      console.log(error);
    } finally {
    }
 
}

export async function Update(
    wallet: WalletContextState,
    connection: Connection,
    feeWallet: PublicKey,
    feePercent: number
) {
  if (!wallet.publicKey) return;
 
    try {
      // Create a transaction to invoke the increment function
      const transaction = await program.methods
        .update({
            feeWallet: feeWallet,
            feePercent: feePercent
        })
        .accounts({
            authority: wallet.publicKey,
            launchpad: launchpadPda,
        })
        .transaction();
 
      const transactionSignature = await wallet.sendTransaction(
        transaction,
        connection,
      );
 
      console.log(
        `update tx id: ${transactionSignature}`,
      );
    } catch (error) {
      console.log(error);
    } finally {
    }
 
}
export const [launchpadPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("launchpad")],
    program.programId,
  );