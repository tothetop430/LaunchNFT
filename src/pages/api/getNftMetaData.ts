import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const object = JSON.parse(req.body);
        const res = await (await fetch(object.uri)).json();
        res.status(200).json({ result: res });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}