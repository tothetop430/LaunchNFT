import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: FC = () => {
    return (
            <footer className="sticky bottom-0 border-t-2 border-[#141414] bg-black hover:text-white w-full" >
                <div className="py-5">
                    <p style={{fontSize: "15", textAlign: "center", color: "gray"}}>&copy;SolPad All Rights Reserved</p>
                </div>
            </footer>
    );
};
