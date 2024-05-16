import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import { CreateProject, GetNftCollections } from 'utils/web3';
import Link from 'next/link';
import { toast } from 'react-toastify';

export const CollectionsView: FC = ({ }) => {

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        GetNftCollections().then(async (values) => {
            console.log(">>> nft collections : ", values);
            let receivedData = [];

            for (let i = 0; i < values.length; i++) {
                const data = {
                    uri: values[i].uri
                };

                await fetch("/api/getNftMetaData", {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(res => {
                    console.log("Great Done!!! ", res);
                });
            }


            // setCollections(values.filter(val => val.uri.endsWith("/metadata/0.json")));
            console.log(">>> collections : ",)
        })
    }, [])

    const image_url = './NFT.svg'; //have to get from url
    const description = "GetNftCollections Err->16 UnexpectedAccountError: The account at the provided address [] is not of the expected type [CandyMachine].Source: SDK Caused By: RangeError: Trying to access beyond buffer length";

    //Read this:

    //All information can be find in item.image_url
    return (
        <div className='flex flex-row flex-wrap justify-start items-center m-4 w-full gap-5'>
            {/* {collections.map((item, ind) => (
                <div key={"collections_" + ind}>
                    <a href={"collection_detail"}>
                        <Collection_Item name={item.name} description={item.description} image_url={item.image} />
                    </a>
                </div>
            ))} */}

            <Collection_Item name={"item.name"} description={description} image_url={"item.image"} price={0} sold={0} />

            {/* {collections.map((item, ind) => (
                <div key = {"collections_" + ind}>
                    <a href = {"collections/" + item.creators[0].address + "/" + item.name}>
                        <Collection_Item name = {item.name} description='Find yourself' image_url={image_url} creator='Find yourself'/>
                    </a>
                </div>
            ))} */}
        </div>
    );
};