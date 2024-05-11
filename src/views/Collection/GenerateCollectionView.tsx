// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { NftMinter } from 'components/NftMinter';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const GenerateCollectionView: FC = ({ }) => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const balance = useUserSOLBalanceStore((s) => s.balance)
    const { getUserSOLBalance } = useUserSOLBalanceStore()

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)
        }
    }, [wallet.publicKey, connection, getUserSOLBalance])

    return (
        <div className="flex flex-col items-center justify-start mt-100 p-20 px-32 py-60">
            <div className="flex flex-col items-center justify-center max-w-1028 w-full bg-black">
                <text className='mb-10 text-center' style={{fontSize: "30px"}}>
                    Collection generator
                </text>
                <div className='w-full opacity-full'>
                    <div className='flex justify-between items-center p-10'>
                        <div className='relative'>
                            1. Details
                        </div>
                        <div className='relative'>
                            2. Generate
                        </div>
                        <div className='Upload'>
                            3. Upload
                        </div>
                        <div className='relative'>
                            4. Deploy
                        </div>
                        <div className='relative'>
                            5. Success
                        </div>
                    </div>
                </div>
                <div className="hidden md:inline-flex align-items-center justify-items gap-6">
                    <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
                </div>
            </div>
        </div>
    );
};
