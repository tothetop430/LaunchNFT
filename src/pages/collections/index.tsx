import type { NextPage } from "next";
import { CollectionsView } from '../../views/CollectionsView';
import "react-multi-carousel/lib/styles.css";

const CollectionsPage: NextPage = (props) => {
    return (
        <div>
            <div className="flex flex-row w-full">
                <CollectionsView />
            </div>
        </div>
    );
};

export default CollectionsPage;