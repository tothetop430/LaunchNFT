import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Home from '../../collection_detail';
import ItemProps from "interfaces/ItemProps";
import { Badge, Button } from "flowbite-react";
import { AiOutlineTwitter, AiOutlineHeart, AiFillUnlock } from "react-icons/ai";
import { CollectionDetailView } from "views/CollectionDetailView";
import { Label, RangeSlider } from "flowbite-react";
import Trending from "components/trending/trending";
import { mintNft } from "utils/web3";

const CollectionDetail: NextPage = (props) => {
  const router = useRouter();
  const { collectionName, address } = router.query;
  const image_url = './NFT.svg';
  const description = 'Created at 05.13.2024';
  // const itemProps = {
  //   name : {collectionName},
  //   collections : {address},
  //   image_url : './NFT.svg',
  //   description : 'Created at 05.13.2024'
  // }

  const [slider_value, setSliderValue] = useState<number>(1);
  const [data, setData] = useState(null);
  const wallet = useWallet();

  const onClickMint = () => {
    mintNft(wallet, address[0]);
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
    <div>
      <div className="flex flex-row">
        <div className="flex flex-row m-4">
          <CollectionDetailView name={"dd"} description={"dd"} image_url={data && data.image} />
        </div>
        <div className="w-full flex flex-row flex-start">
          <div className="flex flex-row w-full">
            <img src={image_url} alt="" className="w-40 h-40" />
            <div className="flex flex-col m-x-3 pl-5">
              <div className="flex flex-col">
                <p style={{ fontSize: '48px' }}>{collectionName}</p>
                <caption>CREATED Tue 06 Feb by <a href={'../../profile/' + address}>{address}</a> on </caption><span><img src="../../public/solana.avatar.svg" alt="" /></span>
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
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-10 justify-center items-center flex flex-col">
                <h1 className="text-sm flex">Minted NFTs</h1>
                <div className="flex">
                    <Trending displayMode={'dark'} data={data && [data, data, data, data, data, data]} />
                </div>
                <div className="fixed bottom-10 z-40 flex bg-gray-50">
                    <div className="flex flex-col justify-center gap-1 items-center ">
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
      </div>
    </div>

  );
};

export default CollectionDetail;
