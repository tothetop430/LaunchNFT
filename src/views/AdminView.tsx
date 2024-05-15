import { ChangeEvent, FC, useEffect, useState } from 'react';
import { FloatingLabel, Button, Label, TextInput, Modal } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { program } from "../anchor/setup";
import Initialize, { GetLaunchpad, Update } from 'utils/web3';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";

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
    const [preAdminWallet, setPreAdminWallet] = useState('');
    const [preBackendWallet, setPreBackendWallet] = useState('');
    const [preFeeWallet, setPreFeeWallet] = useState('');
    const [preCollectionFee, setPreCollectionFee] = useState(0);

    const [launchpad, setLaunchpad] = useState({} as any);

    useEffect(() => {
        GetLaunchpad(wallet).then((value) => {
            if (value) {
                setLaunchpad(value);
                setPreAdminWallet(value.authority.toBase58());
                setPreBackendWallet(value.backendWallet.toBase58());
                setPreFeeWallet(value.feeWallet.toBase58());
                setPreCollectionFee(value.feeCollection.toNumber() /  1000000000);
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
        await Initialize(
            wallet,
            new PublicKey(adminWallet),
            new PublicKey(backendWallet),
            new PublicKey(feeWallet),
            collectionFee * 1000000000
        );
    }

    const updateAdminWallet = async () => {
        console.log("Update Btn clicked");
        await Update(
            wallet,
            new PublicKey(adminWallet),
            new PublicKey(backendWallet),
            new PublicKey(feeWallet),
            collectionFee * 1000000000
        );
    }

    const [openModal, setOpenModal] = useState(false);

    const onClickOKAtModal = () => {
        setOpenModal(true);
        updateAdminWallet();
    }

    return (
        <div className='flex flex-col justify-center items-center mx-auto my-8 p-14 w-4/5 md:w-2/3 lg:w-1/3 gap-3 bg-gray-400 bg-opacity-10 shadow-xl text-3xl text-white'>
            <div className='w-full'>
                <div className="mb-2 block text-white">
                    <Label htmlFor="adminWallet" defaultValue={preAdminWallet} value="Admin Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="adminWallet" type="text" onChange={(e) => onChangeAdminWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="backendWallet" defaultValue={preBackendWallet} value="Backend Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="backendWallet" type="text" onChange={(e) => onChangeBackendWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="feeWallet" defaultValue={preFeeWallet} value="Fee Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="feeWallet" type="text" onChange={(e) => onChangeFeeWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="collectionFee" defaultValue={preCollectionFee} value="Collection Fee" style={{ color: "white" }} />
                </div>
                <TextInput id="collectionFee" type="text" onChange={(e) => onChangeCollectionFee(e)} />
            </div>
            <div className='flex flex-row justify-center mt-10 gap-4'>
                <Button outline gradientDuoTone="greenToBlue" onClick={() => { onClickCreateAdminWallet() }}>
                    Create Admin Panel
                </Button>
                <Button outline gradientDuoTone="greenToBlue" onClick={() => setOpenModal(true)}>
                    Update Admin Panel
                </Button>
            </div>

            {/* ------------- updating confirm Modal ------------- */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to update to current info?
                        </h3>
                        <p>
                            !!!
                            {preAdminWallet}&rarr;{adminWallet}
                            {preBackendWallet}&rarr;{backendWallet}
                            {preFeeWallet}&rarr;{feeWallet}
                            {preCollectionFee}&rarr;{collectionFee}
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => onClickOKAtModal()}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};