import type { NextPage } from "next";
import Head from "next/head";
import { CollectionDetailView } from "../../views/CollectionDetailView";
import ItemProps from "../../interfaces/ItemProps";
import { Label, RangeSlider } from "flowbite-react";
import Trending from "../../components/trending/trending";
import { Badge, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import {
  GetCandyMachine,
  GetMintedNfts,
  GetProject,
  mintCompressedNFT,
  mintNft,
  mintNftWithWallet,
} from "utils/web3";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { useRouter } from "next/router";
import { formatDateToUTC } from "../../utils/formatData";
import { convertResponseToJson } from "utils/convertResponse";
import { PublicKey } from "@solana/web3.js";
// import axios, { AxiosResponse } from 'axios';
// import { CollectionDetailView } from "../../views/CollectionDetailView";

const Home: NextPage = (props: ItemProps) => {
  const [slider_value, setSliderValue] = useState<number>(1);

  const [data, setData] = useState(null);

  const wallet = useWallet();

  const router = useRouter();
  const { project_id } = router.query;
  const [project, setProject] = useState(null);
  const [candyMachineId, setCandyMachineId] = useState(null);
  const [candyMachine, setCandyMachine] = useState(null);
  const [collectionImgUrl, setColImgUrl] = useState("");

  const [mintedNfts, setMintedNfts] = useState([]);

  const [mintLimit, setMintLimit] = useState(0);
  const [mintCost, setMintCost] = useState(0.0);
  const [launchDateTime, setLaunchDateTime] = useState("Not now");

  const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
  const PINATA_GATEWAY_TOKEN = process.env.PINATA_GATEWAY_TOKEN;

  useEffect(() => {
    if (project_id != null) {
      update();
    }
  }, [project_id]);

  const update = () => {
    GetProject(project_id as string).then((value) => {
      setProject(value);
      setMintedNfts([]);

      setCandyMachineId(value.candyMachineId);
      console.log("project", value);
      if (!value.isCnft) {
        GetCandyMachine(value.candyMachineId).then((value2) => {
          setCandyMachine(value2);
          console.log("candyMachine", value2);
          changeUrl(value2, value);
          setMintLimit(value2.candyGuard.guards.mintLimit.limit);
          setMintCost(
            parseFloat(
              value2.candyGuard.guards.solPayment.amount.basisPoints.toString()
            ) / 1000000000
          );
          setLaunchDateTime(
            formatDateToUTC(value2.candyGuard.guards.startDate.date.toNumber())
          );
        });

        changeUrlForImg(value);
      }
    });
  };

  const changeUrl = async (candyMachineData, projectData) => {
    console.log("fffff", candyMachineData.items);
    const filteredItems = candyMachineData.items.filter((nft) => nft.minted);
    let minted = [];
    for (let i = 0; i < filteredItems.length; i++) {
      const nft = filteredItems[i];
      const replacedUri1 =
        nft.uri.replace("gateway.pinata.cloud", PINATA_GATEWAY_URL) +
        `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
      const replacedUri = replacedUri1.replace("http:/", "https:/");

      const res = await fetch(replacedUri);
      const resJson = await res.json();
      minted.push({
        image:
          resJson.image.replace("gateway.pinata.cloud", PINATA_GATEWAY_URL) +
          `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`,
        name: nft.name,
        id: nft.index,
        collectionName: projectData.name,
      });
    }

    setMintedNfts(minted);
  };
  const changeUrlForImg = async (value) => {
    const temp_url1 =
      value.metadataUri.replace("gateway.pinata.cloud", PINATA_GATEWAY_URL) +
      `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
    console.log("hhh", temp_url1, value.metadataUri);
    const temp_url = temp_url1.replace("http:/", "https:/");
    const res = await fetch(temp_url);
    const jsonRes = await res.json();
    const img_temp_url = jsonRes.image.toString();
    setColImgUrl(
      img_temp_url.replace("gateway.pinata.cloud", PINATA_GATEWAY_URL) +
        `?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`
    );
  };

  const onClickMint = async () => {
    if (project.isCnft) {
      await mintCompressedNFT(
        wallet,
        wallet.publicKey,
        new PublicKey(project.candyMachineId),
        new PublicKey(project.collectionMint),
        {
          name: "test",
          uri: "https://shdw-drive.genesysgo.net/91uEGv2pFyc3nZPgya6L41FKaoD6GoTcGDHqhokHe7Hw/compressedNFT1.json",
          symbol: "test",
        }
      );
    } else {
      await mintNftWithWallet(wallet, candyMachineId.toString());
    }
    update();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tmq4w56ps5l6fbu527u4ds4sjlpvd75fyeiqn7ihpumlmmjlkmda.arweave.net/myHLd8-XV-KGndfpwcuSSt9R_6XBEQb9B30YtjErUwY"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
        <CollectionDetailView
          name={project?.name}
          description={
            "Created " + formatDateToUTC(project?.createAt as number)
          }
          image_url={collectionImgUrl}
          mint_limit={mintLimit}
          mint_cost={mintCost}
          launchdatetime={launchDateTime}
        />
      </div>
      <div className="w-full px-10 justify-center items-center flex flex-col">
        <h1 className="flex text-4xl">Minted NFTs</h1>
        <div className="flex">
          <Trending displayMode={"dark"} data={[...mintedNfts]} />
        </div>
        <div className="fixed bottom-30 z-40 flex flex-col w-30 gap-2 justify-center items-center px-6 py-3 rounded-lg bg-gray-600 shadow-xl border border-gray-500">
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
            <RangeSlider
              id="default-range"
              min={1}
              max={100}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              value={slider_value}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
