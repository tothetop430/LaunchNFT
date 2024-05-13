import type { NextPage } from "next";
import Head from "next/head";
import { CollectionsView } from '../views/CollectionsView';
import "react-multi-carousel/lib/styles.css";

const Home: NextPage = (props) => {
    return (
        <div>
            <div className="flex flex-row m-4">
                <CollectionsView />
            </div>
        </div>
    );
};

export default Home;