import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL, LaunchnftContract } from "../anchor/idl";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, BN } from "@coral-xyz/anchor";
import { Metaplex, keypairIdentity, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, toDateTime, sol, walletAdapterIdentity } from "@metaplex-foundation/js";
import MerkleTools from 'merkle-tools';
import crypto from 'crypto';

const programId = new PublicKey("MFuvWTr6ihjMmNrJ1Yb6wXeqgYqWQokQ8wb12SMf6XY");
const RPC1 = 'https://endpoints.omniatech.io/v1/sol/devnet/52013a8ea3cb41299952e259357fbc3f';
const RPC2 = 'https://api.devnet.solana.com';
const SOLANA_CONNECTION1 = new Connection(RPC1);
const SOLANA_CONNECTION2 = new Connection(RPC2);

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
  // const nftCollections = [];
  // for (let i = 0; i < project.length; i++) {
  //   try {
  //     const candyMachineId = project[i].account.candyMachineId;
  //     const candyMachine = await Metaplex.make(SOLANA_CONNECTION2).candyMachines().findByAddress({ address: candyMachineId });
  //     const collectionNftMint = candyMachine.collectionMintAddress;
  //     const collectionNft = await Metaplex.make(SOLANA_CONNECTION2).nfts().findByMint({ mintAddress: collectionNftMint });
  //     // console.log("collectionNft" + i, collectionNft.uri);
  //     nftCollections.push({ uri: collectionNft.uri, name: collectionNft.name, itemsAvailable: candyMachine.itemsAvailable, itemsMinted: candyMachine.itemsMinted, startDate: candyMachine.candyGuard.guards.startDate.date, price: candyMachine.candyGuard.guards.solPayment.amount, candyMachineId: candyMachineId.toString() });
  //   } catch (err) {
  //     console.log("GetNftCollections Err->" + i, err);
  //   }
  // }
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
    });

    console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
    console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

    return collectionNft.address.toString();
  }
  catch (err) {
    console.error("CreateCollectionNft error->", err);
    return "";
  }
}

export async function createCollectionCompressedNft(NFT_METADATAS: string[], WALLET: Keypair): Promise<string[]> {

  const METAPLEX = Metaplex.make(SOLANA_CONNECTION2).use(keypairIdentity(WALLET));

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
  try {
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
          limit: 20,
        },
        solPayment: {
          amount: sol(0.1),
          destination: WALLET.publicKey,
        },
      }
    };
    const METAPLEX = Metaplex.make(SOLANA_CONNECTION2)
      .use(keypairIdentity(WALLET));
    const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings);
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
  })

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