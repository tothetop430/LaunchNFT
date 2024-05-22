import { NextApiRequest, NextApiResponse } from "next";
import { SetProjectData, addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
// const secret = process.env.SECRET as string;
const secret = '41a14iDkoRa6LMLAg8QVRyEeMd2qbneWNzw3GzEKriLdD5NGfNJ9AWJTMtLVh3gnq5i7n2LoKbSo1NN9Ud6s1n4p';

// export const dynamic = 'force-dynamic'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let logMessage = req.body;
    try {
        const object = req.body;
        logMessage += "Getting Object";
        const projectId = object.projectId;
        logMessage += "Getting projectId";
        const nftMetaData = object.metadata;
        logMessage += "Getting nftMetaData";
        const name = object.name;
        logMessage += "Getting name";
        const items = object.items;
        logMessage += "Getting items";
        const wallet = Keypair.fromSecretKey(bs58.decode(secret));
        logMessage += "Getting wallet";
        const data = {
            uploadedCnt : object.uploadedCnt,
            royalty : object.royalty,
            symbol : object.symbol,
            creators : object.creators,
            baseArtName : object.baseArtName,
            launchDate : object.launchDate,
            mintCost : object.mintCost,
            feeWallet : object.feeWallet,
        };
        logMessage += "Getting data";
        console.log(">>> creating collectionNFT -> data ...", data);
        logMessage += ">>> creating collectionNFT -> data ...";
        const collectionNftMint = await createCollectionNft(name, nftMetaData, wallet);
        if(collectionNftMint.length>0){
            console.log("creating candymachine ...", collectionNftMint);
            logMessage += "creating candymachine ...";
            const candyMachineId = await generateCandyMachine(wallet,collectionNftMint,data);
            if(candyMachineId.length == 0) {
                res.status(200).json({error: "Generate Candy Machine failed!"});
            }

            console.log("setting project data ...", projectId, candyMachineId, collectionNftMint, name, nftMetaData);
            logMessage += "setting project data ...";
            // const success = await SetProjectData(
            //     wallet,
            //     new PublicKey(projectId),
            //     new PublicKey(candyMachineId),
            //     new PublicKey(collectionNftMint),
            //     name,
            //     nftMetaData
            // );
            // if(success){
            //     console.log("addint items ...", candyMachineId,items);
            //     logMessage += "addint items ...";
            //     const addItemsSuccess = await addItems(wallet,candyMachineId,items);
            //     if(addItemsSuccess === false) {
            //         res.status(200).json({ error: "addItems failed" }) 
            //     }
            //     res.status(200).json({ result: candyMachineId });
            // }
            // else{
            //     res.status(200).json({ error: "SettingProjectData failed" }) 
            // }
        }
        else{
            res.status(200).json({ error: "createCollectionNft failed" })    
        }        
    } catch (err) {
        res.status(200).json({ error: logMessage })
    }
}

