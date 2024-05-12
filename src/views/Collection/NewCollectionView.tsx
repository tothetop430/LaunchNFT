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

//ipfs

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { NftMinter } from 'components/NftMinter';
import { min } from 'date-fns';
import uploadFile from 'pages/api/upload';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const NewCollectionView: FC = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();

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
    const [picture, setPicture] = useState('');
    const [nfts_base_art_name, setBaseArtName] = useState('NFT #');
    const [nfts_description, setDescription] = useState('{name}-Generated and deployed on LaunchMyNFT.');
    const [nfts_mint_cost, setMintCost] = useState(0.05);
    const [nfts_royalties, setRoyalties] = useState(2.5);
    const [second_royalty, setSecondRoyalty] = useState([{ share: 100, address: "EAoR5kUrSpDtU13denCHVWEYmjnW4MawFPACd1PSGA8M" }])
    const [collection_name, setCollectionName] = useState('');
    const [collection_symbol, setCollectionSymbol] = useState('');
    const [collection_description, setCollectionDescription] = useState('');
    const [launch_date, setLaunchDate] = useState('May 12, 2024');

    const handleChange = (event) => {
        if (event.target.files.length > 0) {
            setPicture(URL.createObjectURL(event.target.files[0]));
        }
        else {
            setPicture('');
        }
    }

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
                                        value={collection_name} onChange={() => setCollectionName(event.target.value)} />
                                </div>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="symbol" value="Symbol" />
                                    </div>
                                    <TextInput id="symbol" type="email" placeholder="MNFT" required color="gray"
                                        value={collection_symbol} onChange={() => setCollectionSymbol(event.target.value)} />
                                </div>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="collection_description" value="Collection Description" />
                                    </div>
                                    <TextInput id="collection_description" type="email" placeholder="My collection description" required color="gray"
                                        value={collection_description} onChange={() => setCollectionDescription(event.target.value)} />
                                </div>
                            </div>
                            <div className='px-1 py-2'>
                                <div className='mb-2'>
                                    <Label htmlFor='launch_date' value='Launch Date'></Label>
                                </div>
                                <Datepicker id='launch_date' value={launch_date} onChange={() => setLaunchDate(event.target.value)} />
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
                                    onChange={() => setBaseArtName(event.target.value)} />
                            </div>
                            <div className='px-1'>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Description" />
                                </div>
                                <Textarea id="description" rows={4} required color="gray" value={nfts_description}
                                    onChange={() => setDescription(event.target.value)} />
                            </div>
                            <div className='flex flex-row justify-start'>
                                <div className='px-1'>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Mlnt Cost" value="Mlnt Cost" />
                                    </div>
                                    <TextInput id="mlnt_cost" rightIcon={SiRust} value={nfts_mint_cost} required
                                        onChange={() => setMintCost(event.target.value)} />
                                </div>
                                <div className='px-1 pr-5'>
                                    <div className='mb-2 block'>
                                        <Label htmlFor='Mlnt Percent' value="Mlnt Percent" />
                                    </div>
                                    <TextInput id="mint_royalties" rightIcon={FaPercent} value={nfts_royalties} required
                                        onChange={() => setRoyalties(event.target.value)} />
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
                                    <div className='flex flex-row items-end'>
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
                                                <MdDelete className="mr-2 h-5 w-5"
                                                    onClick={() => setSecondRoyalty(second_royalty.filter((_, ind) => index !== ind))} />
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
                                        <span className="font-semibold">Click to here or Drag 'n' drop NFT assets folder here</span>
                                    </p>
                                </div>
                                <FileInput id="dropzone-file" multiple itemType='directory' className="hidden" onChange={() => handleChange(event)} />
                            </Label>

                        </div>
                        <p className='text-xm text-gray-500 dark:text-gray-400'>
                            Download example input folder
                        </p>

                        <div className="previewProfilePic w-full" >
                            <div className='flex items-center justify-center mt-6'>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => goTab(0)}>
                                    Back
                                </Button>
                                <Button outline gradientDuoTone="purpleToBlue" pill onClick={() => goTab(0)}>
                                    Continue
                                </Button>
                            </div>
                            {
                                picture != '' &&
                                <div className='max-w-sm pt-10 flex flex-col'>
                                    <img className="playerProfilePic_home_tile w-full pt-10" src={picture}></img>
                                    <label>{nfts_base_art_name}</label>
                                    <label>{collection_symbol}</label>
                                    <div className='flex flex-row flex-start justify-start'>
                                        <Button>Add</Button>
                                        <Button>Edit</Button>
                                        <Button>Del</Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                </Tabs.Item>
                <Tabs.Item title="Deploy">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content 3</p>
                </Tabs.Item>
                <Tabs.Item title="Success!">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content 4</p>
                </Tabs.Item>
            </Tabs>
        </div>

    );
};
