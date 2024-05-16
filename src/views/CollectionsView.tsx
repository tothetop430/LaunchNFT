import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import datalist from '../data/CollectionsData.json';
import { GetNftCollections } from 'utils/web3';
import Link from 'next/link';

export const CollectionsView: FC = ({ }) => {
    const [collections, setCollections] = useState([]);
    useEffect(() => {
        GetNftCollections().then((values) => {
            setCollections(values.filter(val => val.uri.endsWith("/metadata/0.json")));
            // console.log("collections===>", values.)
            console.log("eeeeeeeeeeee", values.filter(val => val.uri.endsWith("/metadata/0.json")))
        })
    }, [])

    const image_url = './NFT.svg'; //have to get from url


    //Read this:

    //All information can be find in item.image_url
    return (
        <div className='flex flex-row flex-wrap justify-start items-center m-4 w-full gap-5'>
            {/* {datalist.map((item, ind) => (
                <div key={"collections_" + ind}>
                    <a href={"collections/" + item.properties.creators[0].address + "/" + item.collections}>
                        <Collection_Item name={item.name} description={item.description} image_url={item.image} collections = {item.collections} />
                    </a>
                </div>
            ))} */}
            {collections.map((item, ind) => (
                <div key={"collections_" + ind}>
                    {/* {
                        console.log(item.uri)
                    } */}
                    {/* <a href = {"collections/" + item.name + "/" + item.name}>
                        <Collection_Item name = {item.name} description='Find yourself' image_url={image_url} creator='Find yourself'/>
                    </a> */}
                    <a href={"collections/" + item.uri.split("/")[4] + "/" + item.name}>
                        <Collection_Item name={item.name} description='Find yourself' image_url={image_url} creator='Find yourself' />
                    </a>
                </div>
            ))}
        </div>
    );
};