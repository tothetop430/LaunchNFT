import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from '../views/CollectionDetailView';
import ItemProps from '../interfaces/ItemProps';
import { Label, RangeSlider } from "flowbite-react";
import Trending from "../components/trending/trending";
import { Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";

const Home: NextPage = (props) => {
    
    const [slider_value, setSliderValue] = useState(1);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://tmq4w56ps5l6fbu527u4ds4sjlpvd75fyeiqn7ihpumlmmjlkmda.arweave.net/myHLd8-XV-KGndfpwcuSSt9R_6XBEQb9B30YtjErUwY');
                if(!response.ok){
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
                <CollectionDetailView name={props.name} description={props.description} image_url={data && data.image} collections={props.collections} />
            </div>
            <div className="w-full px-10 justify-center items-center flex flex-col">
                <h1 className="text-sm flex">Minted NFTs</h1>
                <div className="flex">
                    <Trending displayMode={'dark'} data = {data && [data, data, data, data, data, data]}/>
                </div>
                <div className="fixed bottom-10 z-40 flex bg-gray-50">
                    <div className="flex flex-col justify-center gap-1 items-center ">
                        <div>
                            <RangeSlider id="default-range" min= {1} max = {100} onChange={() => setSliderValue(event.target.value)} value={slider_value}/>
                        </div>
                        <div className="flex gap-1">
                            <Button outline>
                                Mint
                            </Button>
                            <p className="h-5 m-3 items-center text-gray-700">{slider_value}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;