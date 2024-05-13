import { FC } from 'react';
import { Collection_Item } from 'components/Collection_Item';
import datalist from '../data/CollectionsData.json';

export const CollectionsView: FC = ({ }) => {
    return (
        <div className='flex justify-around items-center m-4'>
            {datalist.map((item, ind) => (
                <div key={"collections_" + ind}>
                    <a href={"collections/" + item.properties.creators[0].address + "/" + item.collections}>
                        <Collection_Item name={item.name} description={item.description} image_url={item.image} collections = {item.collections} />
                    </a>
                </div>

            ))}
        </div>
    );
};