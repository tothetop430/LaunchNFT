import { NextApiRequest, NextApiResponse } from "next";
import { addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
// const secret = process.env.SECRET as string;
const secret = "41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const nftMetaData = req.body.metadata;
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        const collectionNftMint = await createCollectionNft(nftMetaData, wallet);
        const candyMachineId = await generateCandyMachine(wallet,collectionNftMint);
        await addItems(wallet,candyMachineId,nftMetaData);
        res.status(200).json({ result: candyMachineId });
    } catch (err) {
        res.status(500).json({ error: err })
    }
 }

//  export const config = {
//     api: {
//       bodyParser: false, // set to true by default which parses request bodies
//       externalResolver: true // sets whether the route is handled by something like Express 
//     }
//   }