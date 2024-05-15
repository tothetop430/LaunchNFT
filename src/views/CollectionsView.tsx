import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import datalist from '../data/CollectionsData.json';
import { GetNftCollections } from 'utils/web3';

export const CollectionsView: FC = ({ }) => {
    const [collections, setCollections] = useState([]);
    useEffect(() => {
        GetNftCollections().then((values) => {
            setCollections(values);
            console.log("collections===>", values)
            
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
                <div key = {"collections_" + ind}>
                    <a href = {"collections/" + item.creators[0].address + "/" + item.name}>
                        <Collection_Item name = {item.name} description='Find yourself' image_url={image_url} creator='Find yourself'/>
                    </a>
                </div>
            ))}
        </div>
    );
};