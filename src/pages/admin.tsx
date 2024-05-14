import type { NextPage } from "next";
import Head from "next/head";
import { AdminView } from '../views/AdminView';

const Home: NextPage = (props) => {
    return (
        <div>
            <Head children={""}>
                <title>NFT Minter</title>
                <meta
                    name="description"
                    content="Solana Scaffold"
                />
            </Head>
            <div className="flex flex-row mt-6">
                <AdminView createAdminPanel={function (): void {
                    throw new Error("Function not implemented.");
                } } />
            </div>
        </div>
    );
};

export default Home;