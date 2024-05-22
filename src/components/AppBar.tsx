import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div>
      {/* NavBar / Header */}
      {/* <div className="navbar flex h-20 flex-row md:mb-2 shadow-lg bg-black text-neutral-content border-b border-zinc-600 bg-opacity-66"> */}
      <div className='navbar fixed top-0 z-50 flex flex-row justify-between items-center px-6 gap-8 w-full h-16 bg-black border-b border-gray-300'>
        <div className="navbar-start align-items-center">
          <div className="sm:inline w-22 h-22 md:p-2 pl-10">
            <Link href="" target="_blank" rel="noopener noreferrer" passHref className="text-secondary hover:text-white">
              <img decoding="async" width="150px" height="auto"
                src="/Solpad_logo.png"
                className="" alt=""
                sizes="(max-width: 800px) 100vw, 800px" />
            </Link>
          </div>
          {/* <a href="https://launchmynft.io/">
            Refresh
          </a> */}
        </div>
        {/* Nav Links */}
        <div className="flex flex-row items-center justify-center gap-10 flex-1 text-2xl">
          <div className="text-white">
            <a className="NavBar_navlink__BklVa" href="/collections">Collections</a>
          </div>
          <div className="text-white">
            <a className="NavBar_navlink__BklVa" href="/create">Create</a>
          </div>
          {/* <div className="text-white">
            <a className="NavBar_navlink__BklVa" href="/admin">Admin</a>
          </div> */}
          {/* <div className="relative group">
            <button className="text-white" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover">Tools</button>
            <div id="dropdownHover" className="absolute hidden top-full left-0 mt-2 w-48 bg-black rounded-md shadow-lg">
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <span className="text-[var(--second-text)] text-xs leading-none">SOLANA TOOLS</span>
                <a className="NavBar_navlink__BklVa" href="/tools/trade">Trade</a>
                <a className="NavBar_navlink__BklVa" href="/tools/send">MultiSend</a>
                <a className="NavBar_navlink__BklVa" href="/tools/update">Update NFT</a>
                <a className="NavBar_navlink__BklVa" href="/tools/mint">Mint Single NFT</a>
                <span className="text-[var(--second-text)] text-xs leading-none">BITCOIN TOOLS</span>
                <a className="NavBar_navlink__BklVa" href="/tools/inscribe">Ordinals Creator</a>
              </div>
            </div>
          </div>
          <div className="text-white">
            <a className="NavBar_navlink__BklVa" href="/faq">FAQ</a>
          </div>
          <div className="text-white">
            <a target="_blank" className="NavBar_navlink__BklVa" href="https://discord.gg/lmnft">Support</a>
          </div> */}
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
            <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
          </div>
          <label
            htmlFor="my-drawer"
            className="btn-gh items-center justify-between md:hidden mr-5"
            onClick={() => setIsNavOpen(!isNavOpen)}>
            <div className="HAMBURGER-ICON space-y-2.5 ml-5">
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
            </div>
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`}
              style={{ transform: "rotate(45deg)" }}>
            </div>
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`}
              style={{ transform: "rotate(135deg)" }}>
            </div>
          </label>
          <div>
            <span className="absolute block h-0.5 w-12 bg-zinc-600 rotate-90 right-14"></span>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-square btn-ghost text-right mr-4">
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52">
              <li>
                <div className="form-control bg-opacity-100">
                  <NetworkSwitcher />
                  <label className="cursor-pointer label">
                    <a>Autoconnect</a>
                    <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
