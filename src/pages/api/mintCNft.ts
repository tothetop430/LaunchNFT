import { NextApiRequest, NextApiResponse } from "next";
import { SetProjectData, addItems, createCollectionAndMerkleTree, createCollectionNft, generateCandyMachine, mintCompressedNFT } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
const secret = process.env.SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        const receiver = object.receiver;
        const treeAddress = object.treeAddress;
        const collectionMint = object.collectionMint;
        const collectionMetadata = object.collectionMetadata;
        const collectionMasterEditionAccount = object.collectionMasterEditionAccount;
        const name = object.name;
        const symbol = object.symbol;
        const uri = object.uri;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        console.log("minting cNFT ...")

        // const collectionCNftMint = await mintCompressedNFT(
        //     wallet, 
        //     new PublicKey(receiver), 
        //     new PublicKey(treeAddress), 
        //     new PublicKey(collectionMint), 
        //     new PublicKey(collectionMetadata),
        //     new PublicKey(collectionMasterEditionAccount),
        //     {
        //         name,
        //         symbol,
        //         uri
        //     }
        // );
        console.log("successfully minted cNFT ...")
              
    } catch (err) {
        res.status(200).json({ error: err })
    }
}

