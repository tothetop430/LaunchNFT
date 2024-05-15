import { useState } from "react";
import { WalletContextState, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IDL, LaunchnftContract } from "../anchor/idl";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, BN } from "@coral-xyz/anchor";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, CandyMachineItem, toDateTime, sol, TransactionBuilder, CreateCandyMachineBuilderContext, walletAdapterIdentity } from "@metaplex-foundation/js";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import MerkleTools from 'merkle-tools';
import crypto from 'crypto';


const programId = new PublicKey("J15m8CpBepW7zWG73o5cao74YrLCjUBCDgtRXroFM3jw");

const RPC = 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(RPC);

export function GetLaunchpadProgram(
  wallet: any,
) {
  const provider = new AnchorProvider(SOLANA_CONNECTION, wallet, {});
  const program = new Program<LaunchnftContract>(IDL, programId, provider);
  return program;
}
export default async function Initialize(
  wallet: WalletContextState,
  adminWallet: PublicKey,
  backendWallet: PublicKey,
  feeWallet: PublicKey,
  feeCollectionSol: number
) {


  if (!wallet.publicKey) return;

  try {
    const program = GetLaunchpadProgram(wallet);

    const feeCollection = new BN(feeCollectionSol);
    const transactionSignature = await program.methods
      .initialize({
        adminWallet,
        backendWallet,
        feeWallet,
        feeCollection
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
) {
  const program = GetLaunchpadProgram(wallet);
  const launchpad = await program.account.launchpad.fetchNullable(launchpadPda);
  return launchpad;
}

export async function GetNftCollections(
  wallet: Keypair,
) {
  const program = GetLaunchpadProgram(wallet);
  console.log("ssssss");
  const project = await program.account.project.all();
  console.log("projects" + project.length);
  const nftCollections = [];
  for (let i = 0; i < project.length; i++) {
    try {
      const candyMachineId = project[i].account.candyMachineId;
      console.log("good candyMachineId", candyMachineId);
      const candyMachine = await Metaplex.make(SOLANA_CONNECTION).candyMachines().findByAddress({ address: candyMachineId });
      // console.log("good candyMachine", candyMachine);
      const collectionNftMint = candyMachine.collectionMintAddress;
      console.log("good collectionNftMint", collectionNftMint);
      const collectionNft = await Metaplex.make(SOLANA_CONNECTION).nfts().findByMint({ mintAddress: collectionNftMint });
      console.log("good collectionNft", collectionNft);
      nftCollections.push({ uri: collectionNft.uri, name: collectionNft.name });
    } catch (err) {
      console.log("Err in web3.ts", err);
    }

  }
  return nftCollections;
  // project[0].account.candyMachineId
  // Metaplex.make().nfts().findByMint()
  // const launchpad = await program.account.launchpad.fetchNullable(launchpadPda);
  // return launchpad;
}

export async function Update(
  wallet: WalletContextState,
  adminWallet: PublicKey,
  backendWallet: PublicKey,
  feeWallet: PublicKey,
  feeCollectionSol: number
) {
  if (!wallet.publicKey) return;

  try {
    const program = GetLaunchpadProgram(wallet);
console.log(">>>", feeCollectionSol);
    const feeCollection = new BN(feeCollectionSol);
    const transactionSignature = await program.methods
      .update({
        adminWallet,
        backendWallet,
        feeWallet,
        feeCollection
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

export const getProjectPda = (projectNumber: BN) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("project"), projectNumber.toArrayLike(Buffer, "le", 8)],
    programId,
  )[0]
}
export async function CreateProject(
  wallet: WalletContextState,
  isCnft: boolean
) {
  try {
    const program = GetLaunchpadProgram(wallet);
    const launchpadAccount = await program.account.launchpad.fetch(launchpadPda);
    const project = getProjectPda(launchpadAccount.projectCount);

    const transactionSignature = await program.methods
      .createProject({
        isCnft
      })
      .accounts({
        creator: wallet.publicKey,
        payer: wallet.publicKey,
        launchpad: launchpadPda,
        feeWallet: launchpadAccount.feeWallet,
        project
      })
      .rpc();

    console.log(
      `createProject tx id: ${transactionSignature}`,
    );
    return project.toString();
  } catch (error) {
    console.log("rrrrrrrrr", error);
  } finally {
  }
}

export async function SetCandyMachineId(
  walletKeypair: Keypair,
  project: PublicKey,
  candyMachineId: PublicKey,
) {
  try {
    const program = GetLaunchpadProgram(new Wallet(walletKeypair));

    const transactionSignature = await program.methods
      .setCandyMachineId({
        candyMachineId
      })
      .accounts({
        authority: walletKeypair.publicKey,
        project
      })
      .rpc();

    console.log(
      `setCandyMachineId tx id: ${transactionSignature}`,
    );
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
//       providerUrl: RPC,
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
//       providerUrl: RPC,
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

export async function createCollectionNft(NFT_METADATA: string, WALLET: Keypair): Promise<string> {
  try {
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
      .use(keypairIdentity(WALLET));
    const { nft: collectionNft } = await METAPLEX.nfts().create({
      name: "NFT Coll",
      uri: NFT_METADATA,
      sellerFeeBasisPoints: 0,
      isCollection: true,
      updateAuthority: WALLET,
    });

    console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
    console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

    return collectionNft.address.toString();
  }
  catch (err) {
    return "failed";
  }
}

export async function createCollectionCompressedNft(NFT_METADATAS: string[], WALLET: Keypair): Promise<string[]> {

  const METAPLEX = Metaplex.make(SOLANA_CONNECTION).use(keypairIdentity(WALLET));

  const treeOptions = {
    hashType: 'md5' //optional, defaults to 'sha256'
  }
  const merkleTools = new MerkleTools(treeOptions);
  const leaves = NFT_METADATAS.map(metadata => {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(metadata));
    return hash.digest('hex');
  })
  merkleTools.addLeaves(leaves, true);
  merkleTools.makeTree();

  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "NFT Coll",
    uri: merkleTools.getMerkleRoot().toString('hex'),
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: WALLET,
  });

  console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

  return [collectionNft.address.toString(), merkleTools.getMerkleRoot().toString('hex')];

}

export async function generateCandyMachine(WALLET: Keypair, COLLECTION_NFT_MINT: string): Promise<string> {
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
    itemSettings: {
      type: 'configLines',
      prefixName: 'My NFT #',
      nameLength: 20,
      prefixUri: '',
      uriLength: 100,
      isSequential: false,
    },
    guards: {
      startDate: { date: toDateTime("2022-10-17T16:00:00Z") },
      mintLimit: {
          id: 1,
          limit: 2,
      },
      solPayment: {
          amount: sol(0.1),
          destination: WALLET.publicKey,
      },
    }
  };
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET));
  const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings);
  console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`);

  return candyMachine.address.toString();
}

export async function updateCandyMachine(WALLET: Keypair, CANDY_MACHINE_ID: string): Promise<string> {
  console.log("############## updateCandyMachine ##################");
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET));
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

  return CANDY_MACHINE_ID
}

export async function addItems(WALLET: Keypair, CANDY_MACHINE_ID: string, items: any[]) {
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: RPC,
      timeout: 60000,
    }));
  const candyMachine = await METAPLEX
    .candyMachines()
    .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });

  const { response } = await METAPLEX.candyMachines().insertItems({
    candyMachine,
    items: [...items],
  }, { commitment: 'finalized' });

  console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}

export async function mintNft(WALLET: WalletContextState, CANDY_MACHINE_ID: string) {
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(walletAdapterIdentity(WALLET))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: RPC,
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
