import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from '../views/CollectionDetailView';
import ItemProps  from '../interfaces/ItemProps';

const Home: NextPage = (props) => {
    return (
        <div>
            {/* <Head>
                <title>NFT Minter</title>
                <meta
                    name="description"
                    content="Solana Scaffold"
                />
            </Head> */}
            <div className="flex flex-row m-4">
                <CollectionDetailView name={props.name} description={props.description} image_url={props.image_url} collections = {props.collections}/>
            </div>
        </div>
    );
};

export default Home;