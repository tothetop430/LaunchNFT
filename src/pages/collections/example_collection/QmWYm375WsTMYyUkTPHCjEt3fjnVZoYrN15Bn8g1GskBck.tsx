import type { NextPage } from "next";
import Home from '../../collection_detail';

const CollectionDetail: NextPage = (props) => {
  return (
    <div>
      <div className="flex flex-row">
        <Home name='example_collection' collections='QmWYm375WsTMYyUkTPHCjEt3fjnVZoYrN15Bn8g1GskBck'
          image_url='./NFT.svg'
          description='Created at 05.13.2024' />
      </div>
    </div>

  );
};

export default CollectionDetail;
