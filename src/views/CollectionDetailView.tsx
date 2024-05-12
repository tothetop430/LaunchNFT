import { FC } from "react";
import { AiOutlineTwitter, AiOutlineHeart, AiFillUnlock } from "react-icons/ai";
import { Badge, Button } from "flowbite-react";

export const CollectionDetailView: FC = (props: any) => {
    const { name, description, image_url } = props;
    return (
        <div>
            <div className="flex flex-row justify-around">
                <img src={image_url} alt="" />
                <div className="flex flex-col m-x-3">
                    <div className="flex flex-col">
                        <h2>{name}</h2>
                        <caption>CREATED Tue 06 Feb by 3989 on </caption><span><img src="../../public/solana.avatar.svg" alt="" /></span>
                        <Badge color="red" icon={AiFillUnlock} />
                        <caption>{description}</caption>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-row">
                            <span><AiOutlineHeart />0</span>
                            <span><AiOutlineTwitter />Verified</span>
                        </div>
                        <div className="flex flex-row">
                            <Button outline>
                                <AiOutlineHeart className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">

                </div>

            </div>
        </div>
    );
};