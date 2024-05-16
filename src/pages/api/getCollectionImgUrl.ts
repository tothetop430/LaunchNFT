import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        // console.log("object", object);
        const resJson = await axios({
            method: "get",
            url: object.url
        });
        // console.log("getUrl:", resJson.data);
        res.status(200).json({ result: resJson.data})
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

