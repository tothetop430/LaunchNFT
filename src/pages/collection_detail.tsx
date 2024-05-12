import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from '../views/CollectionDetailView';

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
                <CollectionDetailView name="example name" description="example description" image_url="example image url"/>
            </div>
        </div>
    );
};

export default Home;