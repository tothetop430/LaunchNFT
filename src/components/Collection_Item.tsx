import { Avatar } from "flowbite-react";
import ItemProps from '../interfaces/ItemProps';
import { useEffect, useState } from "react";
import { GetMintedNfts } from "utils/web3";

export const Collection_Item: React.FC<any> = ({ project }) => {
    //const { name, description, image_url } = props;
    // image_url = NFT;
    // image_url = './NFT.svg';
    console.log(">>> props : ", project);
    const image_url = project.imageUri
    const name = project.account.name;
    console.log(">>> image url, name : ", image_url, name);
    // const candymachineid = project.account.candyMachineId;

    
    return (
        <div className="flex flex-row w-full overflow-hidden items-center border border-gray-200 rounded-lg bg-gray-900 hover:bg-gray-800">
            <div className="flex flex-row w-1/2 h-auto bg-gray-500">
                <img className='object-cover' src={image_url} alt="NFT Image" style={{width: "100%", height: "auto" }} />
            </div>
            <div className='flex flex-col flex-wrap w-1/2 justify-center py-3 px-3' style={{ overflowWrap: "anywhere" }}>
                <div className='flex flex-row w-full justify-between item-center'>
                    <Avatar img={image_url} size="lg" />
                    <div className='flex flex-row items-center justify-around bg-gray-800 p-2 my-auto gap-3 w-100 h-10' style={{ borderRadius: "15px" }}>
                        <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px", borderRadius: "7px" }} />
                        {/* <span style={{ textAlign: "center" }}>{""}</span> */}
                    </div>
                </div>

                <div className="flex flex-col jsutify-center items-start overflow-y-hidden my-3">
                    <h1 className="h-10 my-4 font-extrabold text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-3xl" style={{ color: "white" }}>{name}</h1>
                    <p className="h-10 text-sm font-normal text-gray-500 lg:text-md dark:text-gray-400" style={{ color: "white" }}>
                        {project.account.isCnft ? "cNFT" : "   "}
                    </p>
                </div>
                {/* <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 dark:bg-gray-700">
                    <div className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" style={{ width: "45%" }}></div>
                </div>
                <div className="my-2 text-base font-medium text-green-700 dark:text-green-500">
                    <span style={{ fontSize: "17px" }}>{"sold"} % Sold</span>
                </div> */}
            </div>
        </div>

        // <div className="flex flex-col p-4 justify-center">
        //     <Card className="max-w-sm" imgSrc={image_url} horizontal>
        //         <div className="flex flex-row justify-between">
        //             <Avatar img={image_url} size="md" />
        //             <Badge color="gray" size="xs">
        //                 <Avatar img="../../public/solana.avatar.svg" rounded size="xs">
        //                     <div className="font-medium dark:text-white">
        //                     0.18
        //                     </div>
        //                 </Avatar>
        //             </Badge>
        //         </div>
        //         <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        //             {name}
        //         </h5>
        //         <p className="font-normal text-gray-700 dark:text-gray-400">
        //             {description}
        //         </p>
        //         <Progress progress={45} color="blue" />
        //         <div className="flex flex-row justify-between">
        //             <div className="text-base font-medium text-white-700">xxx %</div>
        //             <div className="text-base font-medium text-gray-700">1276/1800</div>
        //         </div>
        //         <div className="flex flex-row justify-between">
        //             <AiFillHeart /> 0
        //             <AiOutlineTwitter /> Verified
        //         </div>
        //     </Card>
        // </div>
    );
};