import { NextApiRequest, NextApiResponse } from "next";
import { SetProjectData, addItems, createCollectionAndMerkleTree, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
const secret = process.env.SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        const projectId = object.projectId;
        const nftMetaData = object.metadata;
        const name = object.name;
        const symbol = object.symbol;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        console.log("creating collectionNFT ...")
        const data = await createCollectionAndMerkleTree(wallet, name, symbol, nftMetaData);
        console.log("created compressed collection nft!")  
        
        console.log("setting project data ...");
        const success = await SetProjectData(
            wallet,
            new PublicKey(projectId),
            new PublicKey(data.merkleTree),
            new PublicKey(data.collectionMint),
            name,
            nftMetaData
        );
    } catch (err) {
        res.status(200).json({ error: err })
    }
}

