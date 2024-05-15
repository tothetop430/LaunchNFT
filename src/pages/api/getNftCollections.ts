import { NextApiRequest, NextApiResponse } from "next";
import { Keypair, PublicKey } from "@solana/web3.js";
import { GetNftCollections } from "utils/web3";
import * as bs58 from "bs58";
const secret = process.env.SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        const nftCollections = await GetNftCollections(wallet);
        console.log("ssss",nftCollections);
        res.status(200).json({ result: nftCollections });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}