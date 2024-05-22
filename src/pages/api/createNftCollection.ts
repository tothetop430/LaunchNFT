import { NextApiRequest, NextApiResponse } from "next";
import { SetProjectData, addItems, createCollectionNft, generateCandyMachine } from "utils/web3";
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
        console.log(">>> creating collectionNFT -> data ...", data);
        alert(">>> creating collectionNFT -> data ...");
        const collectionNftMint = await createCollectionNft(name, nftMetaData, wallet);
        if(collectionNftMint.length>0){
            console.log("creating candymachine ...", collectionNftMint);
            alert("creating candymachine ...");
            const candyMachineId = await generateCandyMachine(wallet,collectionNftMint,data);
            if(candyMachineId.length == 0) {
                res.status(200).json({error: "Generate Candy Machine failed!"});
            }

            console.log("setting project data ...", projectId, candyMachineId, collectionNftMint, name, nftMetaData);
            alert("setting project data ...");
            const success = await SetProjectData(
                wallet,
                new PublicKey(projectId),
                new PublicKey(candyMachineId),
                new PublicKey(collectionNftMint),
                name,
                nftMetaData
            );
            if(success){
                console.log("addint items ...", candyMachineId,items);
                const addItemsSuccess = await addItems(wallet,candyMachineId,items);
                if(addItemsSuccess === false) {
                    res.status(200).json({ error: "addItems failed" }) 
                }
                res.status(200).json({ result: candyMachineId });
            }
            else{
                res.status(200).json({ error: "SettingProjectData failed" }) 
            }
        }
        else{
            res.status(200).json({ error: "createCollectionNft failed" })    
        }        
    } catch (err) {
        res.status(200).json({ error: err })
    }
}

