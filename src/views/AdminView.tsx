import { FC, useEffect, useState } from 'react';
import { FloatingLabel, Button } from "flowbite-react";


export const AdminView: FC = ({ }) => {
    const [adminWallet, setAdminWallet] = useState('');
    const [feeWallet, setFeeWallet] = useState('');
    const [feeAmount, setFeeAmount] = useState(0);

    const on_click_CreateAdminWallet = () => {

    }

    const on_click_UpdateAdminWallet = () => {

    }

    return (
        <div className='flex flex-col justify-center items-center m-4 w-full gap-3'>
            <FloatingLabel variant="outlined" label="Admin Wallet" name='adminWallet' value={adminWallet} onChange={(e)=>setAdminWallet(e.target.value)} />
            <FloatingLabel variant="outlined" label="Fee Wallet" name='feeWallet' value={feeWallet} onChange={(e)=>setFeeWallet(e.target.value)} />
            <FloatingLabel variant="outlined" label="Fee Amount" name='feeAmount' value={feeAmount} onChange={(e)=>setFeeAmount(parseInt( e.target.value.trim()) )} />
            <div className='flex flex-row justify-center gap-4'>
                <Button outline gradientDuoTone="greenToBlue" onClick={on_click_CreateAdminWallet}>
                    Create Admin Panel
                </Button>
                <Button outline gradientDuoTone="greenToBlue" onClick={on_click_UpdateAdminWallet}>
                    Update Admin Panel
                </Button>
            </div>
        </div>
    );
};