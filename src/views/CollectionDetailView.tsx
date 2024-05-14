import { FC } from "react";
import { AiOutlineTwitter, AiOutlineHeart, AiFillUnlock } from "react-icons/ai";
import { Badge, Button } from "flowbite-react";
import ItemProps from '../interfaces/ItemProps';


export const CollectionDetailView: FC<ItemProps> = ({ name, description, image_url, collections }) => {
    //const { name, description, image_url } = props;
    return (
        <div className="w-full flex flex-row flex-start">
            <div className="flex flex-row w-full">
                <img src={image_url} alt="" className="w-40 h-40" />
                <div className="flex flex-col m-x-3 pl-5">
                    <div className="flex flex-col">
                        <p style={{ fontSize: '48px' }}>{name}</p>
                        <caption>CREATED Tue 06 Feb by <a href={'../../profile/' + collections}>{collections.slice(0, 3) + '..' + collections.slice(collections.length - 2, collections.length)}</a> on </caption><span><img src="../../public/solana.avatar.svg" alt="" /></span>
                        <Badge color="red" icon={AiFillUnlock} className="w-7" />
                        <caption>{description}</caption>
                    </div>
                    <div className="flex flex-row">
                        <div className="items-center justify-center flex flex-row px-3">
                            <AiOutlineHeart /> 0
                        </div>
                        <div className="items-center justify-center flex flex-row px-3">
                            <AiOutlineTwitter />Verified
                        </div>

                        {/* <div className="flex flex-row">
                            <Button outline>
                                <AiOutlineHeart className="h-6 w-6" />
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};