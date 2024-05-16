import { FC } from "react";
import { AiOutlineTwitter, AiOutlineHeart, AiFillUnlock } from "react-icons/ai";
import { Badge, Button } from "flowbite-react";
import ItemProps from '../interfaces/ItemProps';


export const CollectionDetailView: FC<ItemProps> = ({ name, description, image_url, mint_cost, mint_limit, launchdatetime}) => {
    //const { name, description, image_url } = props;
    return (
        <div className="w-full flex flex-row justify-around items-start px-5 py-10">
            <div className="flex flex-row w-full">
                <div className="flex flex-col justify-start items-center w-1/5">
                    <img src={image_url} alt="" className="w-60 h-60" />
                </div>
                <div className="flex flex-col justify-center items-start gap-5 w-2/5 mx-3 pl-5">
                    <h1 style={{ fontSize: '50px', fontWeight: "bold" }}>{name}</h1>
                    <div className="flex flex-row justify-start items-center">
                        <p>{description}</p>
                        &nbsp;
                        <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px" }} />
                    </div>
                    <div>
                        <p>{launchdatetime}</p>
                    </div>
                    <Badge color="red" icon={AiFillUnlock} size="sm" className="p-3" />

                </div>
                <div className="flex flex-col justify-center items-between w-2/5 border border-3 border-gray-500 h-full bg-black">
                    {/* --- TEAM --- */}
                    <div className="flex flex-row justify-between items-center w-full p-4 border border-1 border-gray-500">
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>TEAM</p>
                            &nbsp;&nbsp;
                            <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px" }} />
                            &nbsp;&nbsp;
                            <p style={{ color: "gray" }}> <span style={{ fontSize: "15px" }}>0</span> <span style={{ fontSize: "20px" }}>&nbsp;&#x2223;&nbsp; 90</span> <span style={{ fontSize: "15px" }}>&#8725;&nbsp;user</span> </p>
                        </div>
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>Wallet WL &nbsp;&#8856;</p>
                            &nbsp;&nbsp;&nbsp;
                            <p style={{ fontSize: "17px", color: "gray" }}> &#9679; Ended </p>
                        </div>
                    </div>
                    {/* --- OG --- */}
                    <div className="flex flex-row justify-between items-center w-full p-4 border border-1 border-gray-500">
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>OG</p>
                            &nbsp;&nbsp;
                            <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px" }} />
                            &nbsp;&nbsp;
                            <p style={{ color: "gray" }}> <span style={{ fontSize: "15px" }}>0</span> <span style={{ fontSize: "20px" }}>&nbsp;&#x2223;&nbsp; 5</span> <span style={{ fontSize: "15px" }}>&#8725;&nbsp;user</span> </p>
                        </div>
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>Wallet WL &nbsp;&#8856;</p>
                            &nbsp;&nbsp;&nbsp;
                            <p style={{ fontSize: "17px", color: "gray" }}> &#9679; Ended </p>
                        </div>
                    </div>
                    {/* --- WL --- */}
                    <div className="flex flex-row justify-between items-center w-full p-4 border border-1 border-gray-500">
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>WL</p>
                            &nbsp;&nbsp;
                            <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px" }} />
                            &nbsp;&nbsp;
                            <p style={{ color: "gray" }}> <span style={{ fontSize: "15px" }}>0.06</span> <span style={{ fontSize: "20px" }}>&nbsp;&#x2223;&nbsp; 5</span> <span style={{ fontSize: "15px" }}>&#8725;&nbsp;user</span> </p>
                        </div>
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>Wallet WL &nbsp;&#8856;</p>
                            &nbsp;&nbsp;&nbsp;
                            <p style={{ fontSize: "17px", color: "gray" }}> &#9679; Ended </p>
                        </div>
                    </div>
                    {/* --- Public --- */}
                    <div className="flex flex-col justify-between items-start w-full p-4 border border-1 border-gray-500">
                        <div className="flex flex-row justify-start items-center">
                            <p style={{ fontSize: "17px", fontWeight: "bold" }}>Public</p>
                        </div>
                        <div className="flex flex-row justify-start items-center">
                            <img src="/solana-sol-logo.png" alt="" style={{ width: "20px", height: "20px" }} />
                            &nbsp;&nbsp;
                            <p style={{ color: "gray", fontSize: "15px" }}>{mint_cost}sol Max {mint_limit} mints per wallet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};