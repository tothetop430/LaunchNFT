import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import { GetNftCollections } from 'utils/web3';
import Link from 'next/link';

export const CollectionsView: FC = ({ }) => {

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        GetNftCollections().then((values) => {
            setCollections(values.filter(val => val.uri.endsWith("/metadata/0.json") && val.candyMachineId !== null));
            console.log("eeeeeeeeeeee", values.filter(val => val.uri.endsWith("/metadata/0.json") && val.candyMachineId !== null));

        })
    }, [])

    const image_url = './NFT.svg'; //have to get from url


    //Read this:

    //All information can be find in item.image_url
    return (
        <div className='flex flex-row flex-wrap justify-start items-center m-4 w-full gap-5'>
            {collections.map((item, ind) => (
                <div key={"collections_" + ind}>
                    <a href={"collections/" + item.uri.split("/")[4] + "/" + item.candyMachineId}>
                        <Collection_Item name={item.name} description={item.description} image_url={item.image} />
                    </a>
                </div>
            ))}

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