import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from '../views/CollectionDetailView';
import ItemProps from '../interfaces/ItemProps';
import { Label, RangeSlider } from "flowbite-react";
import Trending from "../components/trending/trending";
import { Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { mintNft } from "utils/web3";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

const Home: NextPage = (props: ItemProps) => {

    const [slider_value, setSliderValue] = useState<number>(1);

    const [data, setData] = useState(null);

    const onClickMint = () => {
        // await mintNft(wallet, updatedCandyMachineID);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://tmq4w56ps5l6fbu527u4ds4sjlpvd75fyeiqn7ihpumlmmjlkmda.arweave.net/myHLd8-XV-KGndfpwcuSSt9R_6XBEQb9B30YtjErUwY');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="pb-10">
            <div className="flex flex-row m-4">
                <CollectionDetailView name={props.name} description={props.description} image_url={data && data.image} />
            </div>
            <div className="w-full px-10 justify-center items-center flex flex-col">
                <h1 className="text-sm flex">Minted NFTs</h1>
                <div className="flex">
                    <Trending displayMode={'dark'} data={data && [data, data, data, data, data, data]} />
                </div>
                <div className="fixed bottom-10 z-40 flex flex-col gap-2 justify-center items-center bg-gray-50 px-6 py-3 rounded-lg bg-gray-700">

                    <div>
                        <RangeSlider id="default-range" min={1} max={100} onChange={(e) => setSliderValue(Number(e.target.value))} value={slider_value} />
                    </div>
                    <div className="flex gap-1">
                        <Button outline onClick={onClickMint}>
                            Mint
                        </Button>
                        <p className="h-5 m-3 items-center text-gray-700">{slider_value}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;