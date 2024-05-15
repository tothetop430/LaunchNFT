import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { FloatingLabel, Button, Label, TextInput, Modal } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { program } from "../anchor/setup";
import Initialize, { GetLaunchpad, Update } from 'utils/web3';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from 'react-toastify';

interface AdminType {
    createAdminPanel: () => void;
}

export const AdminView: FC<AdminType> = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [adminWallet, setAdminWallet] = useState('');
    const [backendWallet, setBackendWallet] = useState('');
    const [feeWallet, setFeeWallet] = useState('');
    const [collectionFee, setCollectionFee] = useState('');

    const [launchpad, setLaunchpad] = useState({} as any);

    useEffect(() => {
        GetLaunchpad(wallet).then((value) => {
            if (value) {
                setLaunchpad(value);
                setAdminWallet(value.authority.toBase58());
                setBackendWallet(value.backendWallet.toBase58());
                setFeeWallet(value.feeWallet.toBase58());
                setCollectionFee((value.feeCollection.toNumber() / 1000000000).toPrecision());
                console.log(">>> collectionFee : ", collectionFee);
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
        setCollectionFee(e.target.value.trim());
    }

    const onClickCreateAdminPanel = async () => {
        console.log("Create Btn clicked");
        toast.info("Transaction is pending..");
        await Initialize(
            wallet,
            new PublicKey(adminWallet),
            new PublicKey(backendWallet),
            new PublicKey(feeWallet),
            parseFloat(collectionFee) * 1000000000
        );
        toast.success("Transation has been completed!");
    }


    const updateAdminPanel = async () => {
        console.log("Update Btn clicked", adminWallet, collectionFee);
        toast.info("Transaction is pending..");
        await Update(
            wallet,
            new PublicKey(adminWallet),
            new PublicKey(backendWallet),
            new PublicKey(feeWallet),
            parseFloat(collectionFee) * 1000000000
        );
        toast.success("Transation has been completed!");
    }

    const [openModal, setOpenModal] = useState(false);

    const onClickOKAtModal = () => {
        setOpenModal(false);
        updateAdminPanel();
    }

    return (
        <div className='flex flex-col justify-center items-center mx-auto my-8 p-14 w-4/5 md:w-2/3 lg:w-1/3 gap-3 bg-gray-400 bg-opacity-10 shadow-xl text-3xl text-white'>
            <div className='w-full'>
                <div className="mb-2 block text-white">
                    <Label htmlFor="adminWallet" value="Admin Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="adminWallet" type="text" defaultValue={adminWallet} onChange={(e) => onChangeAdminWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="backendWallet" value="Backend Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="backendWallet" type="text" defaultValue={backendWallet} onChange={(e) => onChangeBackendWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="feeWallet" value="Fee Wallet" style={{ color: "white" }} />
                </div>
                <TextInput id="feeWallet" type="text" defaultValue={feeWallet} onChange={(e) => onChangeFeeWallet(e)} />
            </div>
            <div className='w-full'>
                <div className="mb-2 block">
                    <Label htmlFor="collectionFee" value="Collection Fee" style={{ color: "white" }} />
                </div>
                <TextInput id="collectionFee" type="text" defaultValue={collectionFee} onChange={(e) => onChangeCollectionFee(e)} />
            </div>
            <div className='flex flex-row justify-center mt-10 gap-4'>
                <Button outline gradientDuoTone="greenToBlue" onClick={() => { onClickCreateAdminPanel() }}>
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
                    <div className="flex flex-col justify-center text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to update to current info?
                        </h3>
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