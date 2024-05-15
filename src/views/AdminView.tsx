import { ChangeEvent, FC, useEffect, useState } from 'react';
import { FloatingLabel, Button, Label, TextInput } from "flowbite-react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { program } from "../anchor/setup";
import Initialize, { GetLaunchpad, Update } from 'utils/web3';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface AdminType {
    createAdminPanel: () => void;
}

export const AdminView: FC<AdminType> = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [adminWallet, setAdminWallet] = useState('');
    const [backendWallet, setBackendWallet] = useState('');
    const [feeWallet, setFeeWallet] = useState('');
    const [collectionFee, setCollectionFee] = useState(0);

    const [launchpad, setLaunchpad] = useState({} as any);

    useEffect(() => {
        GetLaunchpad(wallet).then((value) => {
            if (value) {
                //setLaunchpad(value);
                //setFeeWallet(value.feeWallet.toBase58());
                //setFeeAmount(value.feeCollection);
            }

        })
    }, [])

    const onChangeAdminWallet = (e: ChangeEvent<HTMLInputElement>) => {
        setAdminWallet(e.target.value);
    }

    const onChangeBackendWallet = (e: ChangeEvent<HTMLInputElement>) => {
        setBackendWallet(e.target.value);
    }

    const onChangeFeeWallet = (e: ChangeEvent<HTMLInputElement>) => {
        setFeeWallet(e.target.value);
    }

    const onChangeCollectionFee = (e: ChangeEvent<HTMLInputElement>) => {
        setCollectionFee(parseInt(e.target.value.trim()));
    }

    const onClickCreateAdminWallet = async () => {
        console.log("Create Btn clicked");
        //await Initialize(wallet, connection, new PublicKey(feeWallet), feeAmount * 100);
    }

    const onClickUpdateAdminWallet = async () => {
        console.log("Update Btn clicked");
        //await Update(wallet, connection, new PublicKey(feeWallet), feeAmount * 100);
    }

    return (
        <div className='flex flex-col justify-center items-center mx-auto my-8 p-14 w-4/5 md:w-2/3 lg:w-1/3 gap-3 bg-gray-400 bg-opacity-10 shadow-xl text-3xl'>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="adminWallet" value="Admin Wallet" />
                </div>
                <TextInput id="adminWallet" type="text" onChange={(e) => onChangeAdminWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="backendWallet" value="Backend Wallet" />
                </div>
                <TextInput id="backendWallet" type="text" onChange={(e) => onChangeBackendWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="feeWallet" value="Fee Wallet" />
                </div>
                <TextInput id="feeWallet" type="text" onChange={(e) => onChangeFeeWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="collectionFee" value="Collection Fee" />
                </div>
                <TextInput id="collectionFee" type="text" onChange={(e) => onChangeCollectionFee(e)} />
            </div>
            <div className='flex flex-row justify-center mt-10 gap-4'>
                <Button outline gradientDuoTone="greenToBlue" onClick={() => { onClickCreateAdminWallet() }}>
                    Create Admin Panel
                </Button>
                <Button outline gradientDuoTone="greenToBlue" onClick={() => onClickUpdateAdminWallet()}>
                    Update Admin Panel
                </Button>
            </div>
        </div>
    );
};