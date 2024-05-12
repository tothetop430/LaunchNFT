import { useState } from "react";
import { WalletContextState, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IDL, LaunchnftContract } from "../anchor/idl";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
 
const programId = new PublicKey("HNztz1uSj4fyUfSnaJLeAtmf9pMqnmAFTJArNwBQhfqU");

export function GetLaunchpadProgram(
  wallet: WalletContextState,
  connection: Connection,
){
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<LaunchnftContract>(IDL, programId, provider);
  return program;
}
export default async function Initialize(
    wallet: WalletContextState,
    connection: Connection,
    feeWallet: PublicKey,
    feePercent: number
) {
  
 
  if (!wallet.publicKey) return;
 
    try {
      const program = GetLaunchpadProgram(wallet, connection);
      
      // Create a transaction to invoke the increment function
      const transactionSignature = await program.methods
        .initialize({
            feeWallet: feeWallet,
            feePercent: feePercent
        })
        .accounts({
            authority: wallet.publicKey,
            launchpad: launchpadPda,
        })
        .rpc();
 
      console.log(
        `initialize tx id: ${transactionSignature}`,
      );
    } catch (error) {
      console.log(error);
    } finally {
    }
 
}
export async function GetLaunchpad(
  wallet: WalletContextState,
  connection: Connection,
){
  const program = GetLaunchpadProgram(wallet, connection);
  const launchpad = await program.account.launchpad.fetchNullable(launchpadPda);
  return launchpad;
}
export async function Update(
    wallet: WalletContextState,
    connection: Connection,
    feeWallet: PublicKey,
    feePercent: number
) {
  if (!wallet.publicKey) return;
 
    try {
      const program = GetLaunchpadProgram(wallet, connection);

      // Create a transaction to invoke the increment function
      const transactionSignature = await program.methods
        .update({
            feeWallet: feeWallet,
            feePercent: feePercent
        })
        .accounts({
            authority: wallet.publicKey,
            launchpad: launchpadPda,
        })
        .rpc();
 
 
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
    programId,
  );

export async function CreateProject(
  wallet: WalletContextState,
  connection: Connection,
){
  try {
    const program = GetLaunchpadProgram(wallet, connection);
    
    // Create a transaction to invoke the increment function
    // const transactionSignature = await program.methods
    //   .createProject({
    //       feeWallet: feeWallet,
    //       feePercent: feePercent
    //   })
    //   .accounts({
    //       authority: wallet.publicKey,
    //       launchpad: launchpadPda,
    //   })
    //   .rpc();

    // console.log(
    //   `initialize tx id: ${transactionSignature}`,
    // );
  } catch (error) {
    console.log(error);
  } finally {
  }
}