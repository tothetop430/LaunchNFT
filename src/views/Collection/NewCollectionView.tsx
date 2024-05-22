/* eslint-disable */
"use client";
// Next, React
import React, { FC, useEffect, useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight, HiArrowNarrowLeft, HiCalendar } from "react-icons/hi";
import { Tabs, Label, TextInput, Datepicker, Radio, ToggleSwitch, Textarea, FileInput, TabsRef } from "flowbite-react";
import { TbCurrencySolana } from "react-icons/tb";
import { CgMathPercent } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/router';
import { CreateProject, GetLaunchpad } from 'utils/web3';
// import { CallMe } from '../../compressed_zip/scripts/callMe';

//ipfs
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { NftMinter } from 'components/NftMinter';
import { min } from 'date-fns';
import uploadFile from 'pages/api/upload';
import { updateCandyMachineBuilder } from '@metaplex-foundation/js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        // extends React's HTMLAttributes
        directory?: string;
        webkitDirectory?: string;
    }
}

export const NewCollectionView: FC = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const router = useRouter();

    const [feeWallet, setFeeWallet] = useState('');

    const balance = useUserSOLBalanceStore((s) => s.balance)
    const { getUserSOLBalance } = useUserSOLBalanceStore()

    const [switch1, setSwitch1] = useState(false);
    const [switch2, setSwitch2] = useState(false);
    const [switch3, setSwitch3] = useState(false);
    const [switch4, setSwitch4] = useState(false);
    const [switch5, setSwitch5] = useState(false);
    // const [core_switch, setCoreSwitch] = useState(false);
    const [switchShowMode, setSwitchShowMode] = useState(false);
    const [tabIndex, goTab] = useState(0);
    const [pictures, setPictures] = useState([]);
    const [nfts_base_art_name, setBaseArtName] = useState('NFT #');
    const [nfts_description, setDescription] = useState('{name}-Generated and deployed on LaunchMyNFT.');
    const [nfts_mint_cost, setMintCost] = useState(0.05);
    const [nfts_royalties, setRoyalties] = useState(250);
    const [second_royalty, setSecondRoyalty] = useState([{ share: 100, address: "EAoR5kUrSpDtU13denCHVWEYmjnW4MawFPACd1PSGA8M" }])
    const [collection_name, setCollectionName] = useState('');
    const [collection_symbol, setCollectionSymbol] = useState('');
    const [collection_description, setCollectionDescription] = useState('');
    const [launch_date, setLaunchDate] = useState("2024-05-16T19:30");
    const [dir_upload, setDirUpload] = useState([]);
    const [folder_name, setFolderName] = useState('');
    const [uploadedRes, setUploadedRes] = useState('');
    const [images_to_upload, setImagesToUpload] = useState([]);
    const [metadatas_to_upload, setMetadatasToUpload] = useState([]);

    const REACT_APP_PINATA_API_KEY = '767f0b4ad24034363687';
    const REACT_APP_PINATA_API_SECRET = '75f146e928ba05395e226953152f1528baaf83b86d3d9785875a9cab203810b8';
    const image_count_in_line = 3;

    const parseJsonFile = async (file_name) => {
        console.log(file_name);
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = event => resolve(JSON.parse((event.target as any).result));
            fileReader.readAsText(file_name);
        })
    }

    const [uploadedFileCnt, setUploadedFileCnt] = useState(0);

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(">>> uploaded file list : ", event.target.files); setDirUpload([...event.target.files]);
        const len = event.target.files.length;
        setUploadedFileCnt(len/2);

        if (len > 0) {
            // setImagesToUpload(event.target.files.filter(val =>
            //     val.webkitRelativePath.split('/')[1] == 'images'
            // ).sort((a, b) => a.webkitDirectory.localeCompare(b.webkitDirectory, undefined, { sensitivity: 'base' })));
            // setMetadatasToUpload(event.target.files.filter(val =>
            //     val.webkitRelativePath.split('/')[1] == 'metadata'
            // ).sort((a, b) => a.webkitDirectory.localeCompare(b.webkitDirectory, undefined, { sensitivity: 'base' })));
            const folders = [];
            const temp_images = [];
            const temp_metas = [];
            for (let i = 0; i < len; i++) {
                const dir = event.target.files[i].webkitRelativePath;
                setFolderName(dir.split("/")[0]);
                console.log(">>> file dir : ", dir);
                folders.push(dir.split('/').filter((val, ind) => ind != 0).join("/"));
                if (dir.split('/').filter((val, ind) => ind != 0).join("/").startsWith("images/")) {
                    temp_images.push(event.target.files[i]);
                } else if (dir.split('/').filter((val, ind) => ind != 0).join("/").startsWith("metadata/")) {
                    temp_metas.push(event.target.files[i]);
                }
            }
            setImagesToUpload([...temp_images]);
            setMetadatasToUpload([...temp_metas]);
            if (folders.filter(val => val.startsWith("images/")).length == 0) {
                alert("No Images folder. Must contain it!");
                return;
            }
            const images = folders.filter(val => val.startsWith("images/"));


            //setImageName(event.target.files[0]);
            const newResults = [];
            for (let i = 0; i < images.length; i += image_count_in_line) {
                const newLines = [];
                for (let j = 0; j < image_count_in_line && i + j < images.length; j++) {
                    const img_name = images[i + j].split("/").filter((_: any, ind: number) => ind != 0).join("");
                    const json_path = folders.filter(
                        val =>
                            val.endsWith("/" + img_name.split(".").reverse().filter((_: any, ind: number) => ind != 0).reverse().join(".") + ".json")
                    ).join("");
                    const nft_name = json_path === "" ? "NFT #" + (i + j) : json_path;
                    const nft_desc = json_path === "" ? "NFT #" + (i + j) : json_path;
                    // console.log(folders.indexOf(images[i + j]));
                    // console.log(event.target.files[folders.indexOf(images[i + j])]);
                    newLines.push({
                        img_name: URL.createObjectURL(event.target.files[folders.indexOf(images[i + j])]),
                        nft_name: nft_name,
                        nft_desc: nft_desc,
                        real_name: img_name
                    });
                }
                console.log(">>> push to newResult : ", newLines);
                newResults.push({ val: newLines });
            }
            setPictures(newResults);

            //setPictures(event.target.files);
            //setPicture(URL.createObjectURL(event.target.files[0]));
        }
        else {
            setPictures([]);
        }
    }

    // const loadDirectory = (item: any) => {
    //     console.log(item);
    // }

    // const sendJSONtoIPFS = async (MetaHash) => {

    //     try {

    //         const resJSON = await axios({
    //             method: "post",
    //             url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
    //             data: {
    //                 "name": nfts_base_art_name,
    //                 "description": collection_symbol,
    //                 "image": MetaHash
    //             },
    //             headers: {
    //                 'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
    //                 'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
    //             },
    //         });

    //         console.log("final ", `ipfs://${resJSON.data.IpfsHash}`)
    //         const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
    //         console.log("Token URI", tokenURI);
    //         //mintNFT(tokenURI, currentAccount)   // pass the winner
    //         alert("Thanks for pushing up!!!");
    //         setUploadedRes(resJSON.data);
    //         console.log("=== resJson ===");
    //         console.log(resJSON.data);
    //         // router.push('/collections');

    //     } catch (error) {
    //         console.log("JSON to IPFS: ")
    //         console.log(error);
    //     }

    // }

    const [confirmClicked, setConfirmClicked] = useState(0);

    const sendMetaToIPFS = async (ImgHash, len) => {
        try {

            const formData = new FormData();

            const metadata = JSON.stringify({
                name: folder_name,
            });
            formData.append("pinataMetadata", metadata);
            const temp_files = [];
            for (let i = 0; i < metadatas_to_upload.length; i++) {
                let res = await parseJsonFile(metadatas_to_upload[i]);
                let mut_res = Object.assign({}, res, { image: 'https://gateway.pinata.cloud/ipfs/' + ImgHash + "/images/" + i.toString() + ".jpeg" });
                temp_files.push(mut_res);
            }

            temp_files.map((temp_file, index) => {
                const jsonBlob = new Blob([JSON.stringify(temp_file)], {
                    type: 'application/json'
                });
                formData.append('file', jsonBlob, folder_name + "/metadata/" + index.toString() + ".json");
            });

            const options = JSON.stringify({
                cidVersion: 0,
            });
            formData.append("pinataOptions", options);
            //formData.append("file", image_name);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            // const MetaHash = `ipfs://${resFile.data.IpfsHash}`;
            const MetaHash = resFile.data.IpfsHash;

            setUploadedRes(MetaHash);
            console.log("meta hash", MetaHash)
            // sendJSONtoIPFS(MetaHash);


        } catch (error) {
            console.log("File to IPFS: ")
            console.log(error)
        }
    }

    const sendFileToIPFS = async (e) => {

        e.preventDefault();

        if (pictures.length > 0) {
            try {
                console.log("Images: ");
                console.log(images_to_upload);

                const formData = new FormData();

                const metadata = JSON.stringify({
                    name: folder_name,
                });
                formData.append("pinataMetadata", metadata);
                images_to_upload.map(dir_item => {
                    formData.append('file', dir_item);
                });

                const options = JSON.stringify({
                    cidVersion: 0,
                });
                formData.append("pinataOptions", options);
                //formData.append("file", image_name);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
                        'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                // const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                const ImgHash = resFile.data.IpfsHash;
                // console.log(response.data.IpfsHash);
                // sendJSONtoIPFS(ImgHash, dir_upload.length)
                sendMetaToIPFS(ImgHash, images_to_upload.length);


            } catch (error) {
                console.log("File to IPFS: ")
                console.log(error)
            }

            setConfirmClicked(1);
        }
    }

    // const onClickContinue = (event) => {
    //     pinFileToIPFS(image_name);
    // }

    const updateSecondRoyalty = (event: ChangeEvent<HTMLInputElement>, indexToUpdate: number, mod: number) => {
        const newData = [...second_royalty];
        if (mod == 0) {
            newData[indexToUpdate].share = parseInt(event.target.value);
        }
        else if (mod == 1) {
            newData[indexToUpdate].address = event.target.value;
        }
        setSecondRoyalty(newData);
    }

    const [deploySuccess, setDeploySuccess] = useState(false);

    const handleDeploy = async () => {
        toast("Deploying is pending..") // play notification
        console.log("uploadedRes: ", uploadedRes)
        const hash = uploadedRes;
        const project_id = await CreateProject(wallet, switch1);

        console.log(">>> project created : ", project_id, project_id.length);

        if (project_id.length > 0) {
            if (switch1) {
                console.log(">>> cNFT creation >>>");
                const _items = [];
                for (let i = 0; i < images_to_upload.length; i++) {
                    _items.push({ uri: 'https://gateway.pinata.cloud/ipfs/' + hash + "/metadata/" + i.toString() + ".json", name: collection_name + "#" + (i + 1).toString() });
                }
                const data = {
                    metadata: 'https://gateway.pinata.cloud/ipfs/' + hash + "/metadata/0.json",
                    items: _items,
                    projectId: project_id,
                    name: collection_name,
                    symbol: "TEST"
                }
                await fetch("/api/createCnftCollection", {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(res => {
                    console.log("Great Done!!! ", res);
                });

            } else {
                console.log(">>> NFTcollection creation >>>");
                const _items = [];
                for (let i = 0; i < images_to_upload.length; i++) {
                    _items.push({ uri: 'https://gateway.pinata.cloud/ipfs/' + hash + "/metadata/" + i.toString() + ".json", name: collection_name + "#" + (i + 1).toString() });
                }
                const data = {
                    metadata: 'https://gateway.pinata.cloud/ipfs/' + hash + "/metadata/0.json",
                    items: _items,
                    projectId: project_id,
                    name: collection_name,
                    uploadedCnt: uploadedFileCnt,
                    symbol: collection_symbol,
                    royalty: nfts_royalties,
                    creators: second_royalty,
                    baseArtName: nfts_base_art_name,
                    launchDate: launch_date + ":00Z",
                    mintCost: nfts_mint_cost,
                    feeWallet: feeWallet,
                };
                // await fetch("/api/createNftCollection", {
                //     method: "POST",
                //     body: JSON.stringify(data),
                // }).then(res => {
                //     console.log("Great Done!!! ", res);
                //     setActiveTab(3);
                // });
                const res = await axios({
                    method: 'POST',
                    url: '/api/createNftCollection',
                    data: data
                });
                console.log("Great done!!!", res);
                setActiveTab(3);
            }

            toast("Deploying has been completed!") // delete notificatoin
        }
        else {
            toast.error("Failed to create!")
        }
        // delete notificatoin

    }

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)
        };
        GetLaunchpad(wallet).then((value) => {
            setFeeWallet(value.feeWallet.toBase58());
            console.log(">>> Fee Wallet : ", feeWallet);
        })
    }, [wallet.publicKey, connection, getUserSOLBalance])

    const tabsRef = useRef<TabsRef>(null);
    const [activeTab, setActiveTab] = useState(0);

    const on_clicked_cntf_toggle = () => {
        if (!switch1) {
            setSwitch1(true);
            setSwitch5(true);
        } else {
            setSwitch1(false);
            setSwitch5(false);
        }
    }

    return (
        <div className='flex px-20 py-16 w-1/2 items-center justify-center m-auto my-10 flex-col text-lg text-white' style={{ backgroundColor: "rgba(100,100,100,0.3)", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.4)" }}>
            <h1 className='mb-6 text-center' style={{ fontSize: "40px", fontWeight: "bold" }}>
                Launch Collection
            </h1>

            <Tabs aria-label="Pills" style="pills" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)} className='w-full'>

                {/* -------------------------- Details tab ------------------------------- */}
                <Tabs.Item active title="Details">
                    <div className='flex flex-col gap-3 w-full'>
                        <span className='py-5 text-center w-full' style={{ fontSize: "35px", color: "white" }}>
                            Collection Details
                        </span>
                        <div className='flex flex-col w-full gap-2'>
                            <span style={{ fontSize: "30px" }}>
                                Collection
                            </span>
                            <div className='flex flex-row gap-5'>
                                <div className='px-1 w-1/3'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="collection_name" value="Collection Name" style={{ color: "white" }} />
                                    </div>
                                    <TextInput id="collection_name" type="email" placeholder="My NFTs" required color="gray"
                                        value={collection_name} onChange={(event) => setCollectionName((event.target as any).value)} />
                                </div>
                                <div className='px-1 w-1/3'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="symbol" value="Symbol" style={{ color: "white" }} />
                                    </div>
                                    <TextInput id="symbol" type="email" placeholder="MNFT" required color="gray"
                                        value={collection_symbol} onChange={(event) => setCollectionSymbol((event.target as any).value)} />
                                </div>
                                <div className='px-1 w-1/3'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="collection_description" value="Collection Description" style={{ color: "white" }} />
                                    </div>
                                    <TextInput id="collection_description" type="email" placeholder="My collection description" required color="gray"
                                        value={collection_description} onChange={(event) => setCollectionDescription((event.target as any).value)} />
                                </div>
                            </div>
                            <div className='px-1 py-2'>
                                <div className='mb-2'>
                                    <Label htmlFor='launch_date' value='Launch Date' style={{ color: "white" }}></Label>
                                </div>
                                {/* <datetimep id='launch_date' value={launch_date} onChange={(event) => setLaunchDate((event.target as any).value)} /> */}
                                {/* <DateTimePicker></DateTimePicker> */}
                                <input type='datetime-local' value={launch_date} onChange={(event) => setLaunchDate((event.target as any).value)} style={{color: "black"}} ></input>
                            </div>

                            <div className="flex flex-col w-full items-start gap-2 pl-5 text-left">
                                <ToggleSwitch className='mr-auto' checked={switch1} color="blue" label="Compressed NFTs" onChange={on_clicked_cntf_toggle} />
                                {
                                    !switch1 && <ToggleSwitch className='mr-auto' checked={switch2} color="blue" label="Immutable" onChange={setSwitch2} />
                                }
                                {
                                    !switch1 && <ToggleSwitch className='mr-auto' checked={switch3 && !switch1} color="blue" label="Reveal Later" onChange={setSwitch3} />
                                }
                                {
                                    !switch1 && <ToggleSwitch className='mr-auto' checked={switch4 && !switch1} color="blue" label="Freeze Collection" onChange={setSwitch4} />
                                }
                                {
                                    switch4 && <div className='px-1 py-2'>
                                        <div className='mb-2'>
                                            <Label htmlFor='unfreeze_date' value='Unfreeze Date'></Label>
                                        </div>
                                        <Datepicker id='unfreeze_date' />
                                    </div>
                                }

                                <ToggleSwitch className='mr-auto' checked={switch5} color="blue" label="Enforce Royalties" onChange={setSwitch5} />
                            </div>

                        </div>
                        <div className='flex flex-col justify-start gap-2'>
                            <span style={{ fontSize: "30px" }}>NFTs</span>
                            <div className='px-1'>
                                <div className="mb-2 block">
                                    <Label htmlFor="base_art_name" value="Base art name" style={{ color: "white" }} />
                                </div>
                                <TextInput id="base_art_name" type="text" placeholder="NFT #" required color="gray" value={nfts_base_art_name}
                                    onChange={() => setBaseArtName((event.target as any).value)} />
                            </div>
                            <div className='px-1'>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Description" style={{ color: "white" }} />
                                </div>
                                <Textarea id="description" rows={4} required color="gray" value={nfts_description}
                                    onChange={() => setDescription((event.target as any).value)} />
                            </div>
                            <div className='flex flex-row justify-start'>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="mint_cost" value="Mint Cost" style={{ color: "white" }} />
                                    </div>
                                    <TextInput id="mint_cost" rightIcon={TbCurrencySolana} value={nfts_mint_cost} required
                                        onChange={(event) => setMintCost((event.target as any).value)} />
                                </div>
                                <div className='px-1 pr-5'>
                                    <div className='mb-2 block'>
                                        <Label htmlFor='mint_royalties' value="Royalties" style={{ color: "white" }} />
                                    </div>
                                    <TextInput id="mint_royalties" rightIcon={CgMathPercent} value={nfts_royalties / 100} required
                                        onChange={(event) => setRoyalties((event.target as any).value * 100)} />
                                </div>
                            </div>
                            {/* <TextInput className='px-1 py-4 hidden' id="input_infor" defaultValue="Custom token minting/Whitelists/Sale Phases can be setup later" required /> */}
                        </div>
                        <div className='flex flex-col py-5 w-full gap-2'>
                            <span style={{ fontSize: "30px", color: "white" }}>
                                Secondary Royalty Split
                            </span>
                            {
                                second_royalty.map((val, index) => (
                                    <div className='flex flex-row items-end' key={"second" + index}>
                                        <div className='px-1'>
                                            <div className="mb-2 block">
                                                <Label htmlFor="share" value="Share" style={{ color: "white" }} />
                                            </div>
                                            <TextInput id="share_percent" value={val.share} rightIcon={CgMathPercent} required color="gray"
                                                onChange={(event) => updateSecondRoyalty(event, index, 0)} />
                                        </div>
                                        <div className='px-1 w-full'>
                                            <div className="mb-2 block">
                                                <Label htmlFor="address" value="Address" style={{ color: "white" }} />
                                            </div>
                                            <TextInput id="address" placeholder='Address' value={val.address} className='w-full' required color="gray"
                                                onChange={(event) => updateSecondRoyalty(event, index, 1)} />
                                        </div>
                                        {
                                            index != 0 &&
                                            <div className='flex flex-end justify-end flex-end inline-block mb-2'>
                                                <MdDelete className='mr-2 h-5 w-5' onClick={() => setSecondRoyalty(second_royalty.filter((_, ind) => index !== ind))} />
                                            </div>
                                        }
                                    </div>
                                ))
                            }

                            <div className='flex flex-row justify-center items-center px-1 py-3'>
                                <Button outline color="gray" className='w-full' onClick={() => setSecondRoyalty([...second_royalty, { share: 0, address: "" }])}>
                                    Add split
                                </Button>
                            </div>
                        </div>

                        {/* <div className='flex flex-col hidden'>
                            <span style={{ fontSize: "20px" }}>
                                Show Advanced
                            </span>
                            <ToggleSwitch checked={switchShowMode} color="blue" label="Compressed NFTs" onChange={setSwitchShowMode} />
                            {
                                switchShowMode &&
                                <div className='pt-5'>
                                    <span style={{ fontSize: "15px" }}>
                                        Image Storage
                                    </span>
                                    <fieldset className="flex max-w-md flex-row gap-4">
                                        <div className="flex items-center gap-2">
                                            <Radio id="s3" name="s3" value="s3" defaultChecked />
                                            <Label htmlFor="s3">S3</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Radio id="IPFS" name="ipfs" value="IPFS" />
                                            <Label htmlFor="ipfs">IPFS</Label>
                                        </div>
                                    </fieldset>
                                </div>

                            }
                        </div> */}

                        <div className='flex items-end justify-end mt-6 items-center'>
                            <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => tabsRef.current?.setActiveTab(1)} style={{ textAlign: "center" }}>
                                Next &rarr;
                            </Button>
                        </div>

                    </div>
                </Tabs.Item>

                {/* -------------------------- Upload tab ------------------------------- */}
                <Tabs.Item title="Upload">
                    <div className='flex flex-col items-center justify-center mt-10 gap-3 w-full'>
                        <div className='flex items-center justify-center mb-4 w-full'>
                            <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => tabsRef.current?.setActiveTab(0)}>
                                &larr;&nbsp;Back
                            </Button>
                        </div>
                        <h3>Drop your NFT assets below to launch!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Meta data is optional. To include it provide JSON files with matching file names.
                        </p>
                        <div className="flex w-full items-center justify-center">
                            {/* <DropTarget onDrop={loadDirectory}> */}
                            <Label
                                htmlFor="dropzone-file"
                                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                style={{ color: "white" }}
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    <svg
                                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">{"Click to here or Drag n drop NFT assets folder here"}</span>
                                    </p>
                                </div>
                                {
                                    // eslint-disable-next-line
                                    <FileInput className='' webkitDirectory="true" id="dropzone-file" multiple itemType='directory' onChange={(event) => handleFileInputChange(event)} />
                                }

                            </Label>
                            {/* </DropTarget> */}
                        </div>
                        <p className='text-xm text-gray-500 dark:text-gray-400'>
                            Download example input folder
                        </p>

                        <div className="previewProfilePic w-full mb-5" >
                            <div className='flex items-center justify-center mt-6 gap-4'>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => tabsRef.current?.setActiveTab(0)}>
                                    &larr;&nbsp;Back
                                </Button>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={(e: { preventDefault: () => void; }) => sendFileToIPFS(e)}>
                                    Push up
                                </Button>

                                {
                                    confirmClicked ?
                                        <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => tabsRef.current?.setActiveTab(2)}>
                                            Next&nbsp;&rarr;
                                        </Button>
                                        :
                                        <Button outline gradientDuoTone="purpleToBlue" pill disabled onClick={() => tabsRef.current?.setActiveTab(2)}>
                                            Next&nbsp;&rarr;
                                        </Button>
                                }
                            </div>
                            <div className='flex flex-col'>
                                {
                                    pictures.map((pic_in_line, ind) => (
                                        <div className='grid grid-cols-3 gap-4' key={"pic_line_" + ind}>
                                            {
                                                pic_in_line.val.map((pic, index) => (
                                                    <div className='p-4 flex flex-col flex-start' key={"pic_line_pic_" + index}>
                                                        <img className="playerProfilePic_home_tile w-full pt-10" src={pic.img_name}></img>
                                                        <label style={{ color: "white" }}>{pic.nft_name}</label>
                                                        <label style={{ color: "white" }}>{pic.nft_desc}</label>
                                                        <div className='flex flex-row flex-start justify-around gap-3'>
                                                            <Button>Add</Button>
                                                            <Button>Edit</Button>
                                                            <Button>Del</Button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </Tabs.Item>

                {/* -------------------------- Deploy tab ------------------------------- */}
                <Tabs.Item title="Deploy">
                    <div className='flex flex-col items-center justify-start mt-10 w-full h-full'>
                        <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => handleDeploy()} style={{ width: "200px" }}>
                            Deply!
                        </Button>
                    </div>
                </Tabs.Item>

                {/* -------------------------- Success tab ------------------------------- */}
                <Tabs.Item title="Success!">
                    <div className='flex flex-col items-center justify-start mt-10 gap-3 w-full h-full'>
                        {
                            deploySuccess &&
                            <p className="text-3xl text-gray-500 dark:text-gray-800">You have deploied NFT successfully!</p>
                        }
                    </div>
                </Tabs.Item>

            </Tabs>

        </div>

    );
};
