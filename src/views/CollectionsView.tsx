import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import datalist from '../data/CollectionsData.json';
import { GetNftCollections } from 'utils/web3';

export const CollectionsView: FC = ({ }) => {

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        GetNftCollections().then((values) => {
            setCollections(values);
            console.log("collections===>", values);
            console.log(">>> ", values)
            const dataList = [];
            for (let i = 0; i < values.length; i++) {
                dataList.push(values[i].uri + "/metadata/0.json");
            }
            console.log(">>> dataList : ", dataList);
            setCollections(dataList);
        })
    }, [])

    const image_url = './NFT.svg'; //have to get from url


    //Read this:

    //All information can be find in item.image_url
    return (
        <div className='flex flex-row flex-wrap justify-start items-center m-4 w-full gap-5'>
            {collections.map((item, ind) => (
                <div key={"collections_" + ind}>
                    <a href={"/collection_detail"}>
                        <Collection_Item name={item.name} description='Find yourself' image_url={item.image} creator='Find yourself' />
                    </a>
                </div>
            ))}
        </div>
    );
};