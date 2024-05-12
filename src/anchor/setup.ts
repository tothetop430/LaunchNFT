import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, LaunchnftContract } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
 
const programId = new PublicKey("HNztz1uSj4fyUfSnaJLeAtmf9pMqnmAFTJArNwBQhfqU");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
 
// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program<LaunchnftContract>(IDL, programId, {
  connection,
});