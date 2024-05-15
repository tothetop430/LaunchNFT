import { FC, useEffect, useState } from 'react';
import { FloatingLabel, Button } from "flowbite-react";
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
    const [feeWallet, setFeeWallet] = useState('');
    const [feeAmount, setFeeAmount] = useState(0);
    

    const [launchpad, setLaunchpad] = useState({} as any);

    useEffect(() => {
        GetLaunchpad(wallet).then((value)=>{
            if(value){
                //setLaunchpad(value);
                //setFeeWallet(value.feeWallet.toBase58());
                //setFeeAmount(value.feeCollection);
            }
            
        })
    }, [])

    const on_click_CreateAdminWallet = async () => {
        console.log("clicked")
        //await Initialize(wallet, connection, new PublicKey(feeWallet), feeAmount * 100);
    }

    const on_click_UpdateAdminWallet = async () => {
        //await Update(wallet, connection, new PublicKey(feeWallet), feeAmount * 100);
    }

    return (
        <div className='flex flex-col justify-center items-center m-4 w-full gap-3'>
            <FloatingLabel variant="outlined" label="Fee Wallet" name='feeWallet' value={feeWallet} onChange={(e)=>setFeeWallet(e.target.value)} />
            <FloatingLabel variant="outlined" label="Fee Amount" name='feeAmount' value={feeAmount} onChange={(e)=>setFeeAmount(parseInt( e.target.value.trim()) )} />
            <div className='flex flex-row justify-center gap-4'>
                <Button outline gradientDuoTone="greenToBlue" onClick={(e) => {on_click_CreateAdminWallet()}}>
                    Create Admin Panel
                </Button>
                <Button outline gradientDuoTone="greenToBlue" onClick={(e) => on_click_UpdateAdminWallet()}>
                    Update Admin Panel
                </Button>
            </div>
        </div>
    );
};