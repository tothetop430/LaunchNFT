import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // const object = JSON.parse(req.body);
        // console.log(">>> body.uri : ", object.uri);
        const res = await (await fetch('https://gateway.pinata.cloud/ipfs/QmXPraCJLkhw9aYHsSKBd7ZgzHoV52f9egEdXXZA2dTSGM/metadata/0.json')).json();
        res.status(200).json({ result: res });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}