import { NextApiRequest, NextApiResponse } from "next";
import { SetCandyMachineId, addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
import { it } from "node:test";
// const secret = process.env.SECRET as string;
const secret = "41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        const projectId = object.projectId;
        const nftMetaData = object.metadata;
        const name = object.name;
        const items = object.items;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        const collectionNftMint = await createCollectionNft(name, nftMetaData, wallet);
        if(collectionNftMint.length>0){
            const candyMachineId = await generateCandyMachine(wallet,collectionNftMint);
            await SetCandyMachineId(wallet,new PublicKey(projectId),new PublicKey(candyMachineId));
            await addItems(wallet,candyMachineId,items);
            res.status(200).json({ result: candyMachineId });
        }
        else{
            res.status(500).json({ error: "createCollectionNft failed" })    
        }        
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

