/* eslint-disable */
"use client";
// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";
import { Tabs, Label, TextInput, Datepicker, Radio, ToggleSwitch, Textarea, FileInput } from "flowbite-react";
import { SiRust } from "react-icons/si";
import { FaPercent } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/router';
import { createCollectionNft, generateCandyMachine, updateCandyMachine, mintNft } from 'utils/web3';

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

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const NewCollectionView: FC = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const router = useRouter();

    const balance = useUserSOLBalanceStore((s) => s.balance)
    const { getUserSOLBalance } = useUserSOLBalanceStore()

    const [switch1, setSwitch1] = useState(false);
    const [switch2, setSwitch2] = useState(false);
    const [switch3, setSwitch3] = useState(false);
    const [switch4, setSwitch4] = useState(false);
    const [switch5, setSwitch5] = useState(false);
    const [core_switch, setCoreSwitch] = useState(false);
    const [switchShowMode, setSwitchShowMode] = useState(false);
    const [tabIndex, goTab] = useState(0);
    const [pictures, setPictures] = useState([]);
    const [nfts_base_art_name, setBaseArtName] = useState('NFT #');
    const [nfts_description, setDescription] = useState('{name}-Generated and deployed on LaunchMyNFT.');
    const [nfts_mint_cost, setMintCost] = useState(0.05);
    const [nfts_royalties, setRoyalties] = useState(2.5);
    const [second_royalty, setSecondRoyalty] = useState([{ share: 100, address: "EAoR5kUrSpDtU13denCHVWEYmjnW4MawFPACd1PSGA8M" }])
    const [collection_name, setCollectionName] = useState('');
    const [collection_symbol, setCollectionSymbol] = useState('');
    const [collection_description, setCollectionDescription] = useState('');
    const [launch_date, setLaunchDate] = useState('May 12, 2024');
    const [dir_upload, setDirUpload] = useState([]);
    const [folder_name, setFolderName] = useState('');
    const [uploadedRes, setUploadedRes] = useState(Object);

    const REACT_APP_PINATA_API_KEY = '767f0b4ad24034363687';
    const REACT_APP_PINATA_API_SECRET = '75f146e928ba05395e226953152f1528baaf83b86d3d9785875a9cab203810b8';
    const image_count_in_line = 3;

    const handleChange = (event) => {
        console.log(event.target.files);
        setDirUpload([...event.target.files]);
        const len = event.target.files.length;
        if (len > 0) {
            const folders = [];
            // if (event.target.files[0].name.endsWith(".zip")) {
            //     const zip = new JSZip();
            //     zip.loadAsync(event.target.files[0])
            //         .then((res) => {
            //             const image_names = Object.keys(res.files).filter(element => element.startsWith("images/") && element !== 'images/').sort();
            //             const json_names = Object.keys(res.files).filter(element => element.startsWith("metadata/") && element !== "metadata/").sort();
            //             console.log(image_names);
            //             console.log(json_names);

            //             const newResults = [];
            //             for (let i = 0; i < image_names.length; i += image_count_in_line) {
            //                 const newLines = [];
            //                 for (let j = 0; j < image_count_in_line && i + j < image_names.length; j++) {
            //                     const blob = new Blob([image_names[i + j]], {type: 'image/jpeg'});
            //                     newLines.push({
            //                         img_name: URL.createObjectURL(blob),
            //                         nft_name: json_names[i + j],
            //                         nft_desc: json_names[i + j],
            //                         real_name: image_names[i + j]
            //                     });
            //                     console.log("L:" + newLines);


            //                 }
            //                 newResults.push({ val: newLines });
            //                 console.log("N:" + newResults);
            //             }
            //             console.log("T:", newResults);
            //             setPictures(newResults);
            //             //setDirUpload([...(res.filter(item => item.dir === false))]);
            //         });

            // }
            for (let i = 0; i < len; i++) {
                const dir = event.target.files[i].webkitRelativePath;
                setFolderName(dir.split("/")[0]);
                console.log(dir);
                folders.push(dir.split('/').filter((val, ind) => ind != 0).join("/"));
            }
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
                    const img_name = images[i + j].split("/").filter((_, ind) => ind != 0).join("");
                    const json_path = folders.filter(
                        val =>
                            val.endsWith("/" + img_name.split(".").reverse().filter((_, ind) => ind != 0).reverse().join(".") + ".json")
                    ).join("");
                    const nft_name = json_path === "" ? "NFT #" + (i + j) : json_path;
                    const nft_desc = json_path === "" ? "NFT #" + (i + j) : json_path;
                    console.log(folders.indexOf(images[i + j]));
                    console.log(event.target.files[folders.indexOf(images[i + j])]);
                    newLines.push({
                        img_name: URL.createObjectURL(event.target.files[folders.indexOf(images[i + j])]),
                        nft_name: nft_name,
                        nft_desc: nft_desc,
                        real_name: img_name
                    });
                }
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

    const loadDirectory = (item) => {
        console.log(item);
    }

    // const mintNFT = async (tokenURI) => {


    //     try {
    //         await votingSystemContract.makeAnEpicNFT(tokenURI, winner.address)

    //         let val = await votingSystemContract.getTokenId();
    //         console.log(val)
    //         setTokenID(parseInt(val._hex));


    //     } catch (error) {
    //         console.log("Error while minting NFT with contract")
    //         console.log(error);
    //     }

    // }

    const sendJSONtoIPFS = async (ImgHash) => {

        try {

            const resJSON = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                data: {
                    "name": nfts_base_art_name,
                    "description": collection_symbol,
                    "image": ImgHash,
                },
                headers: {
                    'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
                },
            });

            console.log("final ", `ipfs://${resJSON.data.IpfsHash}`)
            const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
            console.log("Token URI", tokenURI);
            //mintNFT(tokenURI, currentAccount)   // pass the winner
            alert("Thanks for pushing up!!!");
            setUploadedRes(resJSON.data);
            console.log("=== resJson ===");
            console.log(resJSON.data);
            // router.push('/collections');

        } catch (error) {
            console.log("JSON to IPFS: ")
            console.log(error);
        }

    }

    const sendFileToIPFS = async (e) => {

        e.preventDefault();

        if (pictures.length > 0) {
            try {

                const formData = new FormData();

                const metadata = JSON.stringify({
                    name: folder_name,
                });
                formData.append("pinataMetadata", metadata);
                dir_upload.map(dir_item => {
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

                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                // console.log(response.data.IpfsHash);
                sendJSONtoIPFS(ImgHash)


            } catch (error) {
                console.log("File to IPFS: ")
                console.log(error)
            }
        }
    }

    // const onClickContinue = (event) => {
    //     pinFileToIPFS(image_name);
    // }

    const updateSecondRoyalty = (event, indexToUpdate, mod) => {
        const newData = [...second_royalty];
        if (mod == 0) {
            newData[indexToUpdate].share = event.target.value;
        }
        else if (mod == 1) {
            newData[indexToUpdate].address = event.target.value;
        }
        setSecondRoyalty(newData);
    }

    const handleDeploy = async () => {
        const hash = uploadedRes["IpfsHash"];
        const image_url = 'https://ivory-patient-leopard-375.mypinata.cloud/ipfs/' + hash +"/images/0.jpeg?pinataGatewayToken=UaktXIBvDQ5zAtjNkPqKlm1RzIkont4QC5B6sZequYh8zWQv_b6IyxW4Rvm2ig6c";
        // console.log("############");
        // console.log(image_url);
        // const uploadedUri = uploadMetadata(image_url, "image/jpeg", collection_name, collection_description, [], wallet);
        const mintedCollectionNft = await createCollectionNft(image_url, wallet);
        console.log("minted CollectionNFT : ", mintedCollectionNft);
        const createdCandyMachine = await generateCandyMachine(wallet, mintedCollectionNft);
        const updatedCandyMachineID = await updateCandyMachine(wallet, createdCandyMachine);
        mintNft(wallet, updatedCandyMachineID);
    }

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)
        }
    }, [wallet.publicKey, connection, getUserSOLBalance])

    return (
        <div className='flex pt-20 w-full items-center justify-center flex-col'>
            <text className='mb-10 text-center' style={{ fontSize: "30px" }}>
                Lanch Collection
            </text>
            <Tabs aria-label="Pills" style="pills">
                <Tabs.Item active title="Details">
                    <div className='flex flex-col' style={{ width: "800px" }}>
                        <text className='mb-10 text-center pt-10' style={{ fontSize: "40px" }}>
                            Collection Details
                        </text>
                        <div className='flex flex-col w-full justify-start'>
                            <text style={{ fontSize: "35px" }}>
                                Collection
                            </text>
                            <div className='flex flex-row justify-between'>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="collection_name" value="Collection Name" />
                                    </div>
                                    <TextInput id="collection_name" type="email" placeholder="My NFTs" required color="gray"
                                        value={collection_name} onChange={() => setCollectionName((event.target as any).value)} />
                                </div>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="symbol" value="Symbol" />
                                    </div>
                                    <TextInput id="symbol" type="email" placeholder="MNFT" required color="gray"
                                        value={collection_symbol} onChange={() => setCollectionSymbol((event.target as any).value)} />
                                </div>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="collection_description" value="Collection Description" />
                                    </div>
                                    <TextInput id="collection_description" type="email" placeholder="My collection description" required color="gray"
                                        value={collection_description} onChange={() => setCollectionDescription((event.target as any).value)} />
                                </div>
                            </div>
                            <div className='px-1 py-2'>
                                <div className='mb-2'>
                                    <Label htmlFor='launch_date' value='Launch Date'></Label>
                                </div>
                                <Datepicker id='launch_date' value={launch_date} onChange={() => setLaunchDate((event.target as any).value)} />
                            </div>
                            <fieldset className="flex max-w-md flex-row gap-4">
                                <legend className="mb-4">Metadata Standard</legend>
                                <div className="flex items-center gap-2">
                                    <Radio id="metaplex" name="metadata" value="Metaplex" defaultChecked onClick={() => setCoreSwitch(false)} />
                                    <Label htmlFor="metaplex">Metaplex</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Radio id="core" name="metadata" value="Core" onClick={() => setCoreSwitch(true)} />
                                    <Label htmlFor="core">Core</Label>
                                </div>
                            </fieldset>
                            {
                                !core_switch &&
                                <div className="flex max-w-md flex-col gap-4 pt-5">
                                    <ToggleSwitch checked={switch1} color="blue" label="Compressed NFTs" onChange={setSwitch1} />
                                    {
                                        !switch1 && <ToggleSwitch checked={switch2} color="blue" label="Immutable" onChange={setSwitch2} />
                                    }
                                    {
                                        !switch1 && <ToggleSwitch checked={switch3 && !switch1} color="blue" label="Reveal Later" onChange={setSwitch3} />
                                    }
                                    {
                                        !switch1 && <ToggleSwitch checked={switch4 && !switch1} color="blue" label="Freeze Collection" onChange={setSwitch4} />
                                    }
                                    {
                                        switch4 && <div className='px-1 py-2'>
                                            <div className='mb-2'>
                                                <Label htmlFor='unfreeze_date' value='Unfreeze Date'></Label>
                                            </div>
                                            <Datepicker id='unfreeze_date' />
                                        </div>
                                    }

                                    <ToggleSwitch checked={switch5} color="blue" label="Enforce Royalties" onChange={setSwitch5} />
                                </div>
                            }

                        </div>
                        <div className='flex flex-col justify-start'>
                            <text style={{ fontSize: "50px" }}>NFTs</text>
                            <div className='px-1'>
                                <div className="mb-2 block">
                                    <Label htmlFor="base_art_name" value="Base art name" />
                                </div>
                                <TextInput id="base_art_name" type="text" placeholder="NFT #" required color="gray" value={nfts_base_art_name}
                                    onChange={() => setBaseArtName((event.target as any).value)} />
                            </div>
                            <div className='px-1'>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Description" />
                                </div>
                                <Textarea id="description" rows={4} required color="gray" value={nfts_description}
                                    onChange={() => setDescription((event.target as any).value)} />
                            </div>
                            <div className='flex flex-row justify-start'>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Mlnt Cost" value="Mlnt Cost" />
                                    </div>
                                    <TextInput id="mlnt_cost" rightIcon={SiRust} value={nfts_mint_cost} required
                                        onChange={() => setMintCost((event.target as any).value)} />
                                </div>
                                <div className='px-1 pr-5'>
                                    <div className='mb-2 block'>
                                        <Label htmlFor='Mlnt Percent' value="Mlnt Percent" />
                                    </div>
                                    <TextInput id="mint_royalties" rightIcon={FaPercent} value={nfts_royalties} required
                                        onChange={() => setRoyalties((event.target as any).value)} />
                                </div>
                            </div>
                            <TextInput className='px-1 py-4 hidden' id="input_infor" value="Custom token minting/Whitelists/Sale Phases can be setup later" required />
                        </div>
                        <div className='flex flex-col w-full'>
                            <text style={{ fontSize: "30px" }}>
                                Secondary Royalty Split
                            </text>
                            {
                                second_royalty.map((val, index) => (
                                    <div className='flex flex-row items-end' key={"second" + index}>
                                        <div className='px-1'>
                                            <div className="mb-2 block">
                                                <Label htmlFor="share" value="Share" />
                                            </div>
                                            <TextInput id="share_percent" value={val.share} rightIcon={FaPercent} required color="gray"
                                                onChange={() => updateSecondRoyalty(event, index, 0)} />
                                        </div>
                                        <div className='px-1 w-full'>
                                            <div className="mb-2 block">
                                                <Label htmlFor="address" value="Address" />
                                            </div>
                                            <TextInput id="address" placeholder='Address' value={val.address} className='w-full' required color="gray"
                                                onChange={() => updateSecondRoyalty(event, index, 1)} />
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

                            <div className='px-1 py-3 w-full'>
                                <Button outline gradientDuoTone="purpleToBlue" className='w-full' onClick={() => setSecondRoyalty([...second_royalty, { share: 0, address: "" }])}>
                                    Add split
                                </Button>
                            </div>
                        </div>
                        <div className='flex flex-col hidden'>
                            <text style={{ fontSize: "20px" }}>
                                Show Advanced
                            </text>
                            <ToggleSwitch checked={switchShowMode} color="blue" label="Compressed NFTs" onChange={setSwitchShowMode} />

                            {
                                switchShowMode &&
                                <div className='pt-5'>
                                    <text style={{ fontSize: "15px" }}>
                                        Image Storage
                                    </text>
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
                        </div>
                        <div className='flex items-end justify-end mt-6'>
                            <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => goTab(1)}>
                                Next
                            </Button>
                        </div>

                    </div>
                </Tabs.Item>
                <Tabs.Item title="Upload">
                    <div className='flex flex-col items-center justify-center mt-16 gap-3' style={{ width: "800px" }}>
                        <div className='flex items-center justify-center mt-6'>
                            <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => goTab(0)}>
                                Back
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
                                    <FileInput className='' id="dropzone-file" multiple itemType='directory' onChange={() => handleChange(event)} />
                                }

                            </Label>
                            {/* </DropTarget> */}


                        </div>
                        <p className='text-xm text-gray-500 dark:text-gray-400'>
                            Download example input folder
                        </p>

                        <div className="previewProfilePic w-full" >
                            <div className='flex items-center justify-center mt-6'>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => goTab(0)}>
                                    Back
                                </Button>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => sendFileToIPFS(event)}>
                                    Continue
                                </Button>
                            </div>
                            <div className='flex flex-col'>
                                {
                                    pictures.map((pic_in_line, ind) => (
                                        <div className='grid grid-cols-3 gap-4' key={ind * (pic_in_line + 1)}>
                                            {
                                                pic_in_line.val.map((pic, index) => (
                                                    <div className='p-4 flex flex-col flex-start' key={ind * (pic_in_line + 1) + index}>
                                                        <img className="playerProfilePic_home_tile w-full pt-10" src={pic.img_name}></img>
                                                        <label>{pic.nft_name}</label>
                                                        <label>{pic.nft_desc}</label>
                                                        <div className='flex flex-row flex-start justify-start'>
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
                <Tabs.Item title="Deploy">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content 3</p>
                    <Button onClick={handleDeploy}>Deploy</Button>
                </Tabs.Item>
                <Tabs.Item title="Success!">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content 4</p>
                </Tabs.Item>
            </Tabs>
        </div>

    );
};
