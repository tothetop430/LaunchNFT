import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from '../../views/CollectionDetailView';
import ItemProps from '../../interfaces/ItemProps';
import { Label, RangeSlider } from "flowbite-react";
import Trending from "../../components/trending/trending";
import { Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { GetCandyMachine, GetMintedNfts, GetProject, mintNft } from "utils/web3";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { useRouter } from "next/router";
import { formatDateToUTC } from '../../utils/formatData';
// import axios, { AxiosResponse } from 'axios';
// import { CollectionDetailView } from "../../views/CollectionDetailView";

const Home: NextPage = (props: ItemProps) => {

    const [slider_value, setSliderValue] = useState<number>(1);

    const [data, setData] = useState(null);

    const wallet = useWallet();

    const router = useRouter();
    const { project_id } = router.query;
    const [project, setProject] = useState<{name : string, createAt: Date}>();
    const [candyMachineId, setCandyMachineId] = useState(null)
    const [candyMachine, setCandyMachine] = useState(null)
    const [collectionImgUrl, setColImgUrl] = useState('');

    const [mintedNfts, setMintedNfts] = useState([])

    useEffect(() => {
        if (candyMachineId != null) {
            GetMintedNfts(candyMachineId).then((values) => {
                setMintedNfts(values)
                console.log("mintedNFTs", values)
            })
        }

    }, [candyMachineId, project, candyMachine])

    useEffect(() => {
        if (project_id != null) {
            GetProject(project_id as string).then((value) => {
                setProject(value)
                setCandyMachineId(value.candyMachineId)
                console.log("project", value);
                GetCandyMachine(value.candyMachineId).then((value2) => {
                    setCandyMachine(value2)
                    console.log("candyMachine", value2);
                })

                //to get img_url of collection
                const data = {
                    url: value.metadataUri
                }
                fetch("/api/getCollectionImgUrl", {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(res => {
                    console.log("json:", res.json());
                })
            })
        }

    }, [project_id])

    const onClickMint = () => {
        mintNft(wallet, candyMachineId.toString());
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
                <CollectionDetailView name={project.name} description={"Created " + formatDateToUTC(project.createAt as Date)} image_url={"./NFT.svg"} />
            </div>
            <div className="w-full px-10 justify-center items-center flex flex-col">
                <h1 className="text-sm flex text-4xl">Minted NFTs</h1>
                <div className="flex">
                    <Trending displayMode={'dark'} data={data && [data, data, data, data, data, data]} />
                </div>
                <div className="fixed bottom-10 z-40 flex flex-col w-30 gap-2 justify-center items-center bg-gray-50 px-6 py-3 rounded-lg bg-gray-600 shadow-xl border border-gray-500">

                    <div className="flex flex-row w-full justify-center items-center">
                        <div className="flex flex-row justify-center w-3/4">
                            <Button outline onClick={onClickMint}>
                                Mint
                            </Button>
                        </div>
                        <div className="flex flex-row justify-center w-1/4">
                            <p className="h-5 m-3 items-center text-white">{slider_value}</p>

                        </div>
                    </div>
                    <div className="flex w-full">
                        <RangeSlider id="default-range" min={1} max={100} onChange={(e) => setSliderValue(Number(e.target.value))} value={slider_value} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;