import { FC, useEffect, useState } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import { CreateProject, GetNftCollections } from 'utils/web3';
import Link from 'next/link';
import { toast } from 'react-toastify';

export const CollectionsView: FC = ({ }) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        GetNftCollections().then(async (values) => {
            console.log(">>> projects : ", values);

            for (let i = 0; i < values.length; i++) {
                const value = values[i]
                let uri = value.account.metadataUri

                if(uri == ''){
                    // show demo uri
                    uri = "https://gateway.pinata.cloud/ipfs/QmXPraCJLkhw9aYHsSKBd7ZgzHoV52f9egEdXXZA2dTSGM/metadata/0.json";
                }
                
                try{
                    const baseUrl = window.location.origin;
                    let res;
                    if(baseUrl.includes("localhost")){
                        res = JSON.parse('{"name":"NFT #0","symbol":"123123123","description":"NFT #0 - Generated and deployed on LaunchMyNFT.","attributes":[{"trait_type":"Accessory","value":"Tear Tattoo Red"},{"trait_type":"Background","value":"Black"},{"trait_type":"Face","value":"Round Aqua"},{"trait_type":"Left Eye","value":"Swirl Purple"},{"trait_type":"Mouth","value":"Grin Pink"},{"trait_type":"Right Eye","value":"Swirl Pink"},{"trait_type":"Rarity Rank","value":48,"display_type":"number","max_value":100}],"image":"https://gateway.pinata.cloud/ipfs/QmYA2eiJ4AiaMtgXz965bTuARgJt8eAEX4Yhew4G8RmLAX/images/0.jpeg"}') as any;
                    }
                    else{
                        try{
                            const result = await fetch(uri, {mode: 'no-cors'});
                            res = await result.json()
                        }
                        catch(e){
                            res = JSON.parse('{"name":"NFT #0","symbol":"123123123","description":"NFT #0 - Generated and deployed on LaunchMyNFT.","attributes":[{"trait_type":"Accessory","value":"Tear Tattoo Red"},{"trait_type":"Background","value":"Black"},{"trait_type":"Face","value":"Round Aqua"},{"trait_type":"Left Eye","value":"Swirl Purple"},{"trait_type":"Mouth","value":"Grin Pink"},{"trait_type":"Right Eye","value":"Swirl Pink"},{"trait_type":"Rarity Rank","value":48,"display_type":"number","max_value":100}],"image":"https://gateway.pinata.cloud/ipfs/QmYA2eiJ4AiaMtgXz965bTuARgJt8eAEX4Yhew4G8RmLAX/images/0.jpeg"}') as any;
                        }
                    }
                    
                    setProjects([...projects, {
                        ...value,
                        imageUri: res.image
                    }]);
                    console.log("Great Done!!! ", res.image); // this should print the url to console
                }
                catch(e){}
                
            }


            // setCollections(values.filter(val => val.uri.endsWith("/metadata/0.json")));
            console.log(">>> collections : ",)
        })
    }, [])

    const description = "GetNftCollections Err->16 UnexpectedAccountError: The account at the provided address [] is not of the expected type [CandyMachine].Source: SDK Caused By: RangeError: Trying to access beyond buffer length";

    //Read this:

    //All information can be find in item.image_url
    return (
        <div className='flex flex-row flex-wrap justify-start items-center m-4 w-full gap-5'>
            {projects.length}
            {projects.map((item, ind) => (
                <div key={"project_" + ind}>
                    <a href={"project_detail/" + item.publicKey.toString()}>
                        <Collection_Item project={item} />
                    </a>
                </div>
            ))}

            {/* <Collection_Item name={"item.name"} description={description} image_url={"item.image"} price={0} sold={0} /> */}

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