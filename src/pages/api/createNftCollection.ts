import { NextApiRequest, NextApiResponse } from "next";
import { SetCandyMachineId, addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
const secret = process.env.SECRET as string;

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
            const success = await SetCandyMachineId(wallet,new PublicKey(projectId),new PublicKey(candyMachineId));
            if(success){
                await addItems(wallet,candyMachineId,items);
                res.status(200).json({ result: candyMachineId });
            }
            else{
                res.status(200).json({ error: "createCollectionNft failed" }) 
            }
        }
        else{
            res.status(200).json({ error: "createCollectionNft failed" })    
        }        
    } catch (err) {
        res.status(200).json({ error: err })
    }
}

