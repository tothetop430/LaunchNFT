import { NextApiRequest, NextApiResponse } from "next";
import { GetNftCollections, SetCandyMachineId, addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
// const secret = process.env.SECRET as string;
const secret = "41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const projectId = req.body.prjectId;
        const nftMetaData = req.body.metadata;
        const items = req.body.items;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        const collectionNftMint = await createCollectionNft(nftMetaData, wallet);
        const candyMachineId = await generateCandyMachine(wallet,collectionNftMint);
        await SetCandyMachineId(wallet,new PublicKey(projectId),new PublicKey(candyMachineId));
        await addItems(wallet,candyMachineId,items);
        res.status(200).json({ result: candyMachineId });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

