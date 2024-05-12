import { FC } from 'react';
import { AiFillHeart, AiOutlineTwitter } from "react-icons/ai";
import { Card, Carousel, Avatar, Badge, Progress } from "flowbite-react";
import { url } from 'inspector';
import { link } from 'fs';

interface Props {
    name : string;
    description : string;
    image_url : string;
}

export const Collection_Item: React.FC<Props> = ({ name, description, image_url }) => {
    return (
        <div className="flex flex-col p-4 justify-center">
            <Card className="max-w-sm" imgSrc={image_url} horizontal>
                <div className="flex flex-row justify-between">
                    <Avatar img={image_url} size="md" />
                    <Badge color="gray" size="xs">
                        <Avatar img="../../public/solana.avatar.svg" rounded size="xs">
                            <div className="font-medium dark:text-white">
                            0.18
                            </div>
                        </Avatar>
                    </Badge>
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {description}
                </p>
                <Progress progress={45} color="blue" />
                <div className="flex flex-row justify-between">
                    <div className="text-base font-medium text-white-700">xxx %</div>
                    <div className="text-base font-medium text-gray-700">1276/1800</div>
                </div>
                <div className="flex flex-row justify-between">
                    <AiFillHeart /> 0
                    <AiOutlineTwitter /> Verified
                </div>
            </Card>
        </div>
    );
};