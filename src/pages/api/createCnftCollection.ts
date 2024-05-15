import { NextApiRequest, NextApiResponse } from "next";
import { GetNftCollections, SetCandyMachineId, addItems, generateCandyMachine, createCollectionCompressedNft } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
// const secret = process.env.SECRET as string;
const secret = "41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        const projectId = object.projectId;
        const nftMetaDatas = object.metadatas;
        const items = object.items;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        const [collectionCnftMint, collection_url] = await createCollectionCompressedNft(nftMetaDatas, wallet);
        const candyMachineId = await generateCandyMachine(wallet,collectionCnftMint);
        await SetCandyMachineId(wallet,new PublicKey(projectId),new PublicKey(candyMachineId));
        // await addItems(wallet,candyMachineId,items);
        await addItems(wallet, candyMachineId, [collection_url])
        res.status(200).json({ result: candyMachineId });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}