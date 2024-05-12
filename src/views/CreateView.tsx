// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../components/RequestAirdrop';

// Store
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';
import { NftMinter } from 'components/NftMinter';

import { Card } from "flowbite-react";

export const CreateView: FC = ({ }) => {
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
        <div className="flex flex-col items-center justify-center mt-176 p-20">
            <div className="flex flex-wrap items-center justify-center gap-10">
                <div className="flex flex-col items-center justify-center gap-12 border border-gray-300 rounded-lg">
                    <svg width="115" height="108" viewBox="0 0 115 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                            <path d="M30.7349 51.4986C41.5017 51.4986 56.146 51.4986 62.7863 58.8622C70.8732 67.8385 72.391 100.625 72.391 100.625C72.391 100.625 72.391 66.4393 81.9958 58.8622C90.5452 52.1152 103.268 51.4986 114.047 51.4986C103.28 51.4986 89.9879 50.0401 81.9958 44.135C72.391 37.0322 72.391 2.37213 72.391 2.37213C72.391 2.37213 72.391 35.1943 62.7863 44.135C55.5175 50.9057 41.5136 51.4986 30.7349 51.4986Z" stroke="var(--second-colour)" strokeWidth="1.89474" strokeMiterlimit="10" />
                            <path d="M0 26.5138C5.81028 26.5138 13.7075 26.5138 17.2885 30.4862C21.6522 35.3241 22.4704 53.0158 22.4704 53.0158C22.4704 53.0158 22.4704 34.5771 27.6522 30.4862C32.2648 26.8458 39.1304 26.5138 44.9407 26.5138C39.1304 26.5138 31.9565 25.7194 27.6522 22.5415C22.4704 18.6996 22.4704 0 22.4704 0C22.4704 0 22.4704 17.7036 17.2885 22.5296C13.3636 26.1818 5.81028 26.502 0 26.502L0 26.5138Z" stroke="var(--second-colour)" strokeWidth="1.89474" strokeMiterlimit="10" />
                            <path d="M18.2729 83.7053C23.597 83.7053 30.8184 83.7053 34.103 87.3456C38.099 91.7804 38.846 107.978 38.846 107.978C38.846 107.978 38.846 91.0926 43.5891 87.3456C47.8105 84.0136 54.0951 83.7053 59.4192 83.7053C54.0951 83.7053 47.5377 82.982 43.5891 80.065C38.846 76.5551 38.846 59.4326 38.846 59.4326C38.846 59.4326 38.846 75.642 34.103 80.065C30.5101 83.4088 23.597 83.7053 18.2729 83.7053V83.7053Z" stroke="var(--second-colour)" strokeWidth="1.89474" strokeMiterlimit="10" />
                        </g>
                        <defs>
                            <clipPath id="clip0">
                                <rect width="114.047" height="108" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <strong className="font-elza text-2xl text-center">New Collection</strong>
                    <span className="text-base max-w-xs text-center">Already have your NFT assets? Upload and launch your NFT collection.</span>
                    <a href="/collections/launch" className="block w-full px-8 py-3 mt-4 bg-gray-700 rounded-full text-white text-center font-semibold text-sm">New Collection</a>
                </div>
                <div className="flex flex-col items-center justify-center gap-12 border border-gray-300 rounded-lg">
                    <svg width="120" height="114" viewBox="0 0 120 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M78.5611 56.9784C87.1433 56.9784 94.1006 50.0211 94.1006 41.4389C94.1006 32.8566 87.1433 25.8993 78.5611 25.8993C69.9788 25.8993 63.0215 32.8566 63.0215 41.4389C63.0215 50.0211 69.9788 56.9784 78.5611 56.9784Z" stroke="var(--second-colour)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M101.028 26.1279C101.807 27.2438 102.489 28.4244 103.067 29.6567L111.452 34.3186C112.499 39.0079 112.51 43.8692 111.485 48.5632L103.067 53.2251C102.489 54.4574 101.807 55.638 101.028 56.7538L101.19 66.3689C97.6361 69.6071 93.4302 72.0467 88.8551 73.5236L80.5997 68.5704C79.2417 68.6675 77.8785 68.6675 76.5205 68.5704L68.2975 73.4913C63.7079 72.0412 59.4882 69.611 55.9306 66.3689L56.0925 56.7862C55.3196 55.6549 54.6376 54.4641 54.0529 53.2251L45.668 48.5632C44.621 43.8739 44.61 39.0126 45.6357 34.3186L54.0529 29.6567C54.6307 28.4244 55.3131 27.2438 56.0925 26.1279L55.9306 16.5128C59.4842 13.2747 63.69 10.8351 68.2651 9.35815L76.5205 14.3114C77.8785 14.2143 79.2417 14.2143 80.5997 14.3114L88.8227 9.39053C93.4123 10.8406 97.632 13.2707 101.19 16.5128L101.028 26.1279Z" stroke="var(--second-colour)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M31.0792 93.6708C37.5159 93.6708 42.7339 88.4529 42.7339 82.0162C42.7339 75.5795 37.5159 70.3615 31.0792 70.3615C24.6425 70.3615 19.4246 75.5795 19.4246 82.0162C19.4246 88.4529 24.6425 93.6708 31.0792 93.6708Z" stroke="var(--second-colour)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M47.9296 70.5355C48.5142 71.3724 49.0259 72.2578 49.4593 73.182L55.748 76.6785C56.5332 80.1954 56.5415 83.8414 55.7722 87.3619L49.4593 90.8583C49.0259 91.7826 48.5142 92.668 47.9296 93.5049L48.051 100.716C45.3859 103.145 42.2315 104.975 38.8001 106.082L32.6086 102.367C31.5901 102.44 30.5677 102.44 29.5492 102.367L23.382 106.058C19.9397 104.97 16.775 103.148 14.1068 100.716L14.2282 93.5292C13.6485 92.6807 13.137 91.7876 12.6985 90.8583L6.40983 87.3619C5.62459 83.8449 5.61631 80.199 6.38555 76.6785L12.6985 73.182C13.1319 72.2578 13.6436 71.3724 14.2282 70.5355L14.1068 63.3241C16.7719 60.8955 19.9263 59.0658 23.3577 57.9581L29.5492 61.6731C30.5677 61.6002 31.5901 61.6002 32.6086 61.6731L38.7758 57.9824C42.2181 59.0699 45.3828 60.8926 48.051 63.3241L47.9296 70.5355Z" stroke="var(--second-colour)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <strong className="font-elza text-2xl text-center">Generate Collection</strong>
                    <span className="text-base max-w-xs text-center">Create and launch your randomly generated NFT collection.</span>
                    <a href="/collections/generate" className="block w-full px-8 py-3 mt-4 bg-gray-700 rounded-full text-white text-center font-semibold text-sm">Generate Collection</a>
                </div>
            </div>
        </div>
    );
};
