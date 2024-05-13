import type { NextPage } from "next";
import Home from '../../collection_detail';

const CollectionDetail: NextPage = (props) => {
  return (
    <Home name = 'example_user' collections = 'QmWYm375WsTMYyUkTPHCjEt3fjnVZoYrN15Bn8g1GskBck' 
    image_url = 'https://assets.pinit.io/6EJZzNJ36dQatQzGzKrSHUyvmpCLdcjcMMpAc3vSEUbe/56c23f1b-4caf-405b-aef5-e3f491ea66a0/1275' 
    description = 'Created at 05.13.2024'/>
  );
};

export default CollectionDetail;
