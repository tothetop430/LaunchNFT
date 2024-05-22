import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL, LaunchnftContract } from "../anchor/idl";
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, BN } from "@coral-xyz/anchor";
import { Metaplex, keypairIdentity, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, toDateTime, sol, walletAdapterIdentity } from "@metaplex-foundation/js";
import {
  ValidDepthSizePair,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import crypto, { sign } from 'crypto';
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createTree, createCollection, mintCompressedNFTIxn } from "./compression"
import { NFTMetadata, createCompressedNFTMetadata } from "./onChainNFTs";
import bs58 from "bs58";

const programId = new PublicKey("6foDgAivQKhJwiHkbW8X6gyoZ1PJi338AhffirgUA8Ym");
const RPC1 = 'https://white-late-uranium.solana-devnet.quiknode.pro/dd0d46ae7809fdac680bca7d4c1562698f3d8920';
const RPC2 = 'https://white-late-uranium.solana-devnet.quiknode.pro/dd0d46ae7809fdac680bca7d4c1562698f3d8920';
const SOLANA_CONNECTION1 = new Connection(RPC1);
const SOLANA_CONNECTION2 = new Connection(RPC2);

const RECEIVER_MINIMUM_LAMPORTS = 1_000_000;


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
const META_PID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
export const getMetadataPda = (nftMint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), META_PID.toBuffer(), nftMint.toBuffer()],
    META_PID,
  )[0]
}

export const getMasterEditionPda = (nftMint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), META_PID.toBuffer(), nftMint.toBuffer(), Buffer.from("edition"),],
    META_PID,
  )[0]
}

export function GetLaunchpadProgram(
  wallet: any,
) {

  const provider = new AnchorProvider(SOLANA_CONNECTION1, wallet, {});
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
    console.log("Initialize Error-> ", error);
  } finally {
  }
}

export async function GetLaunchpad(
  wallet: WalletContextState,
) {
  try {
    const program = GetLaunchpadProgram(wallet);
    const launchpad = await program.account.launchpad.fetchNullable(launchpadPda);
    return launchpad;
  }
  catch (error) {
    console.log("GetLaunchpad Error-> ", error);
    return null;
  }
}

export async function GetNftCollections() {
  const wallet = Keypair.generate();
  const program = GetLaunchpadProgram(wallet);
  const projects = await program.account.project.all();
  return projects;
}
export async function GetCandyMachine(candyMachineId) {
  const candyMachine = await Metaplex.make(SOLANA_CONNECTION2).candyMachines().findByAddress({ address: candyMachineId });
  return candyMachine;
}
export async function GetProject(projectId: string) {
  const wallet = Keypair.generate();
  const program = GetLaunchpadProgram(wallet);
  const project = await program.account.project.fetch(new PublicKey(projectId));
  return project;
}
export async function GetMintedNfts(candyMachine) {
  return await Metaplex.make(SOLANA_CONNECTION2).candyMachinesV2().findMintedNfts({ candyMachine })
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
    console.log("Update Error->", error);
  }
}

export async function CreateProject(
  wallet: WalletContextState,
  isCnft: boolean
) {
  try {
    console.log("isCnft ->", isCnft);
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
    console.log("createProject : error->", error);
    return "";
  }
}

export async function SetProjectData(
  walletKeypair: Keypair,
  project: PublicKey,
  candyMachineId: PublicKey,
  collectionMint: PublicKey,
  name: string,
  metadataUri: string,
) {
  try {
    const program = GetLaunchpadProgram(new Wallet(walletKeypair));
    const transactionSignature = await program.methods
      .setProjectData({
        candyMachineId,
        collectionMint,
        name,
        metadataUri
      })
      .accounts({
        authority: walletKeypair.publicKey,
        project
      })
      .rpc();

    console.log(
      `SetProjectData tx id: ${transactionSignature}`,
    );
    return true;
  } catch (error) {
    console.log("SetProjectData Error->", error);
    return false;
  }
}

export async function createCollectionNft(name: string, metadataUri: string, WALLET: Keypair): Promise<string> {
  try {
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(keypairIdentity(WALLET));
    const { nft: collectionNft } = await METAPLEX.nfts().create({
      name: name,
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      isCollection: true,
      updateAuthority: WALLET,
    }, {commitment: "finalized"});

    console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
    console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

    return collectionNft.address.toString();
  }
  catch (err) {
    console.error("CreateCollectionNft error->", err);
    return "";
  }
}
export async function createCollectionAndMerkleTree(payer: Keypair, name: string, symbol: string, uri: string) {
  console.log("Payer address:", payer.publicKey.toBase58());

  const connection = SOLANA_CONNECTION2;
  /*
    Define our tree size parameters
  */
  const maxDepthSizePair: ValidDepthSizePair = {
    // max=8 nodes
    maxDepth: 3,
    maxBufferSize: 8,

    // max=16,384 nodes
    //  maxDepth: 14,
    //  maxBufferSize: 64,

    // max=131,072 nodes
    // maxDepth: 17,
    // maxBufferSize: 64,

    // max=1,048,576 nodes
    // maxDepth: 20,
    // maxBufferSize: 256,

    // max=1,073,741,824 nodes
    // maxDepth: 30,
    // maxBufferSize: 2048,
  };
  const canopyDepth = maxDepthSizePair.maxDepth - 3;

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /*
    For demonstration purposes, we can compute how much space our tree will 
    need to allocate to store all the records. As well as the cost to allocate 
    this space (aka minimum balance to be rent exempt)
    ---
    NOTE: These are performed automatically when using the `createAllocTreeIx` 
    function to ensure enough space is allocated, and rent paid.
  */

  // calculate the space available in the tree
  const requiredSpace = getConcurrentMerkleTreeAccountSize(
    maxDepthSizePair.maxDepth,
    maxDepthSizePair.maxBufferSize,
    canopyDepth,
  );

  // const storageCost = await connection.getMinimumBalanceForRentExemption(requiredSpace);

  // // demonstrate data points for compressed NFTs
  // console.log("Space to allocate:", numberFormatter(requiredSpace), "bytes");
  // console.log("Estimated cost to allocate space:", numberFormatter(storageCost / LAMPORTS_PER_SOL));
  // console.log(
  //   "Max compressed NFTs for collection:",
  //   numberFormatter(Math.pow(2, maxDepthSizePair.maxDepth)),
  //   "\n",
  // );

  // // ensure the payer has enough balance to create the allocate the Merkle tree
  // if (initBalance < storageCost) return console.error("Not enough SOL to allocate the merkle tree");
  // printConsoleSeparator();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /*
    Actually allocate the tree on chain
  */

  // define the address the tree will live at
  const treeKeypair = Keypair.generate();

  // create and send the transaction to create the tree on chain
  const tree = await createTree(connection, payer, treeKeypair, maxDepthSizePair, canopyDepth);

  /*
    Create the actual NFT collection (using the normal Metaplex method)
    (nothing special about compression here)
  */

  // define the metadata to be used for creating the NFT collection
  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name,
      symbol,
      // specific json metadata for the collection
      uri,
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payer.publicKey,
          verified: false,
          share: 100,
        },
      ], // or set to `null`
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  // create a full token mint and initialize the collection (with the `payer` as the authority)
  const collection = await createCollection(connection, payer, collectionMetadataV3);

  /**
   * INFO: NFT collection != tree
   * ---
   * NFTs collections can use multiple trees for their same collection.
   * When minting any compressed NFT, simply pass the collection's addresses
   * in the transaction using any valid tree the `payer` has authority over.
   *
   * These minted compressed NFTs should all still be apart of the same collection
   * on marketplaces and wallets.
   */

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  return {collectionMint : collection.mint.toString(), merkleTree : tree.treeAddress.toString()};
}

export async function mintCompressedNFT(
  payer1: WalletContextState, 
  receiver: PublicKey, 
  treeAddress: PublicKey,
  collectionMint: PublicKey,
  // collectionMetadataAccount: PublicKey,
  // collectionMasterEditionAccount: PublicKey,
  nftMetadata: NFTMetadata
){
  const payer = Keypair.fromSecretKey(bs58.decode("41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p"));
const compressedNFTMetadata = createCompressedNFTMetadata(nftMetadata, payer);
const collectionMetadataAccount = getMetadataPda(collectionMint);
const collectionMasterEditionAccount = getMasterEditionPda(collectionMint);
const mintIxn = mintCompressedNFTIxn(
  payer,
  treeAddress,
  collectionMint,
  collectionMetadataAccount,
  collectionMasterEditionAccount,
  compressedNFTMetadata,
  receiver,
);

  try {
    // construct the transaction with our instructions, making the `payer` the `feePayer`
    const tx = new Transaction().add(
      // We'll add a small amount of lamports to the TipLink account
      // SystemProgram.transfer({
      //   fromPubkey: payer.publicKey,
      //   toPubkey: receiver,
      //   lamports: RECEIVER_MINIMUM_LAMPORTS,
      // }),
      mintIxn,
    );
    tx.feePayer = payer.publicKey;

  // send the transaction to the cluster
  let blockhash = (await SOLANA_CONNECTION2.getLatestBlockhash('finalized')).blockhash;
  tx.recentBlockhash = blockhash;
  const txSignature = await sendAndConfirmTransaction(SOLANA_CONNECTION2, tx, [payer], {
    commitment: "confirmed",
    skipPreflight: true,
  });
  // const txSignature = await SOLANA_CONNECTION2.sendTransaction(signedTx, [collectionAuthority]);

    console.log("\nSuccessfully minted the compressed NFT!");
    // console.log(explorerURL({ txSignature, cluster: "mainnet-beta" }));

    return txSignature;
  } catch (err) {
    console.error("\nFailed to mint compressed NFT:", err);

    // log a block explorer link for the failed transaction
    // await extractSignatureFromFailedTransaction(connection, err);

    throw err;
  }
}


export async function generateCandyMachine(WALLET: Keypair, COLLECTION_NFT_MINT: string, data: { uploadedCnt: number; royalty: number; symbol: string; creators: []; baseArtName: string; launchDate: string; mintCost: number; feeWallet: string }): Promise<string> {
  console.log(" ### generateCandyMachine ### ", data);
  try {
    const candyMachineSettings: CreateCandyMachineInput<DefaultCandyGuardSettings> =
    {
      itemsAvailable: toBigNumber(data.uploadedCnt), // Collection Size: 3
      sellerFeeBasisPoints: data.royalty, // 1000, // 10% Royalties on Collection
      symbol: data.symbol,
      maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
      isMutable: true,
      creators: data.creators.map((item: any)=>{ return {address: new PublicKey(item.address), share: item.share}}), // [ { address: WALLET.publicKey, share: 100 }, ],
      collection: {
        address: new PublicKey(COLLECTION_NFT_MINT), // Can replace with your own NFT or upload a new one
        updateAuthority: WALLET,
      },
      itemSettings: {
        type: 'configLines',
        prefixName: data.baseArtName,
        nameLength: 20,
        prefixUri: '',
        uriLength: 100,
        isSequential: false,
      },
      guards: {
        startDate: { date: toDateTime(data.launchDate) }, // { date: toDateTime("2022-10-17T16:00:00Z") }
        mintLimit: {
          id: 1,
          limit: 20,
        },
        solPayment: {
          amount: sol(data.mintCost),
          destination: new PublicKey(data.feeWallet), // WALLET.publicKey,
        },
      }
    };

    console.log(" ### CandyMachineSettings : ", candyMachineSettings);

    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(keypairIdentity(WALLET));
    const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings, {commitment: "finalized"});
    console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`);
    console.log(`     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`);
    return candyMachine.address.toString();
  }
  catch (e) {
    console.log("Error in GenerateCandyMachine: ", e);
  }
}

export async function updateCandyMachine(WALLET: Keypair, CANDY_MACHINE_ID: string): Promise<string> {
  const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
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
  }, {commitment: "finalized"})

  console.log(`✅ - Updated Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);

  return CANDY_MACHINE_ID
}

export async function addItems(WALLET: Keypair, CANDY_MACHINE_ID: string, items: any[]) {
  try {
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(keypairIdentity(WALLET));
    const candyMachine = await METAPLEX
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });

    console.log("additems->", items);
    const { response } = await METAPLEX.candyMachines().insertItems({
      candyMachine,
      items: [...items],
    }, { commitment: 'finalized' });

    console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`);
    console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
  }
  catch (err) {
    console.log("addItems Error->", err);
  }
}

export async function mintNftWithWallet(WALLET: WalletContextState, CANDY_MACHINE_ID: string) {
  try {
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(walletAdapterIdentity(WALLET))
    const candyMachine = await METAPLEX
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });
    let { nft, response } = await METAPLEX.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: candyMachine.authorityAddress,
    }, { commitment: 'finalized' })
    console.log(`✅ - Minted NFT: ${nft.address.toString()}`);
    console.log(`     https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
    console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
    return true;
  }
  catch (err) {
    console.log("Mint NFT Error -> ", err)
    return false;
  }
}

export async function mintNft(WALLET: Keypair, CANDY_MACHINE_ID: string) {
  try {
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(keypairIdentity(WALLET))
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
    return true;
  }
  catch (err) {
    console.log("Mint NFT Error -> ", err)
    return false;
  }
}
