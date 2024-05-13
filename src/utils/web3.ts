import { useState } from "react";
import { WalletContextState, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IDL, LaunchnftContract } from "../anchor/idl";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, CandyMachineItem, toDateTime, sol, TransactionBuilder, CreateCandyMachineBuilderContext, walletAdapterIdentity } from "@metaplex-foundation/js";


const programId = new PublicKey("HNztz1uSj4fyUfSnaJLeAtmf9pMqnmAFTJArNwBQhfqU");

const QUICKNODE_RPC = 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

export function GetLaunchpadProgram(
  wallet: WalletContextState,
  connection: Connection,
) {
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
) {
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
) {
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


// export async function uploadImage(filePath: string, fileName: string, WALLET: WalletContextState): Promise<string> {
//   console.log(`Step 1 - Uploading Image`);
//   const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
//     .use(walletAdapterIdentity(WALLET))
//     .use(bundlrStorage({
//       address: 'https://devnet.bundlr.network',
//       providerUrl: QUICKNODE_RPC,
//       timeout: 60000,
//     }));
//   const CONFIG = {
//     uploadPath: 'uploads/',
//     imgFileName: 'image.png',
//     imgType: 'image/png',
//     imgName: 'QuickNode Pixel',
//     description: 'Pixel infrastructure for everyone!',
//     attributes: [
//       { trait_type: 'Speed', value: 'Quick' },
//       { trait_type: 'Type', value: 'Pixelated' },
//       { trait_type: 'Background', value: 'QuickNode Blue' }
//     ],
//     sellerFeeBasisPoints: 500,//500 bp = 5%
//     symbol: 'QNPIX',
//     creators: [
//       { address: WALLET.publicKey, share: 100 }
//     ]
//   };
//   const imgBuffer = fs.readFileSync(filePath + fileName);
//   const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
//   const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
//   console.log(`   Image URI:`, imgUri);
//   return imgUri;
// }

// export async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, attributes: { trait_type: string, value: string }[], WALLET: Keypair) {
//   console.log(`Step 2 - Uploading Metadata`);
//   const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
//     .use(keypairIdentity(WALLET))
//     .use(bundlrStorage({
//       address: 'https://devnet.bundlr.network',
//       providerUrl: QUICKNODE_RPC,
//       timeout: 60000,
//     }));
//   const { uri } = await METAPLEX
//     .nfts()
//     .uploadMetadata({
//       name: nftName,
//       description: description,
//       image: imgUri,
//       attributes: attributes,
//       properties: {
//         files: [
//           {
//             type: imgType,
//             uri: imgUri,
//           },
//         ]
//       }
//     });
//   console.log('   Metadata URI:', uri);
//   return uri;
// }

export async function createCollectionNft(NFT_METADATA: string, WALLET: WalletContextState) : Promise<string> {
  // const QUICKNODE_RPC = 'https://example.solana-devnet.quiknode.pro/0123456/';
  const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC, { commitment: 'finalized' });
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET));
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "QuickNode Demo NFT Collection",
    uri: NFT_METADATA,
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: WALLET,
  });

  console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

  return collectionNft.address.toString();
}

export async function generateCandyMachine(WALLET: WalletContextState, COLLECTION_NFT_MINT: string) : Promise<string> {
  console.log("######### generateCandyMachine #############");
  const candyMachineSettings: CreateCandyMachineInput<DefaultCandyGuardSettings> =
  {
    itemsAvailable: toBigNumber(3), // Collection Size: 3
    sellerFeeBasisPoints: 1000, // 10% Royalties on Collection
    symbol: "DEMO",
    maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
    isMutable: true,
    creators: [
      { address: WALLET.publicKey, share: 100 },
    ],
    collection: {
      address: new PublicKey(COLLECTION_NFT_MINT), // Can replace with your own NFT or upload a new one
      updateAuthority: WALLET,
    },
  };
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: QUICKNODE_RPC,
      timeout: 60000,
    }));
  const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings);
  console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`);

  return candyMachine.address.toString();
}

export async function updateCandyMachine(WALLET: WalletContextState, CANDY_MACHINE_ID: string) {
  console.log("############## updateCandyMachine ##################");
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: QUICKNODE_RPC,
      timeout: 60000,
    }));
  const candyMachine = await METAPLEX
    .candyMachines()
    .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });

  const { response } = await METAPLEX.candyMachines().update({
    candyMachine,
    guards: {
      startDate: { date: toDateTime("2022-10-17T16:00:00Z") },
      mintLimit: {
        id: 1,
        limit: 2,
      },
      solPayment: {
        amount: sol(0.1),
        destination: METAPLEX.identity().publicKey,
      },
    }
  })

  console.log(`✅ - Updated Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}

// export async function addItems(WALLET: WalletContextState, CANDY_MACHINE_ID: string, NFT_METADATA: string) {
//   const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
//     .use(keypairIdentity(WALLET))
//     .use(bundlrStorage({
//       address: 'https://devnet.bundlr.network',
//       providerUrl: QUICKNODE_RPC,
//       timeout: 60000,
//     }));
//   const candyMachine = await METAPLEX
//     .candyMachines()
//     .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });
//   const items = [];
//   for (let i = 0; i < 3; i++) { // Add 3 NFTs (the size of our collection)
//     items.push({
//       name: `QuickNode Demo NFT # ${i + 1}`,
//       uri: NFT_METADATA
//     })
//   }
//   const { response } = await METAPLEX.candyMachines().insertItems({
//     candyMachine,
//     items: items,
//   }, { commitment: 'finalized' });

//   console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`);
//   console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
// }

export async function mintNft(WALLET: WalletContextState, CANDY_MACHINE_ID: string) {
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: QUICKNODE_RPC,
      timeout: 60000,
    }));
  const candyMachine = await METAPLEX
    .candyMachines()
    .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });
  let { nft, response } = await METAPLEX.candyMachines().mint({
    candyMachine,
    collectionUpdateAuthority: WALLET.publicKey,
  }, { commitment: 'finalized' })

  console.log(`✅ - Minted NFT: ${nft.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}