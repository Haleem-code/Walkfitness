"use client";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useState, useRef, useEffect } from "react";
import { useNetwork } from "@/hooks/useNetwork";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, Wallet } from "lucide-react";

interface CustomWalletMultiButtonProps {
  isModal?: boolean;
}

export function CustomWalletMultiButton({ isModal = false }: CustomWalletMultiButtonProps) {
  const { publicKey, connecting, connected, disconnect, select, wallets } =
    useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supportedWalletNames = ["Backpack", "Nightly", "OKX"];
  const filteredWallets = wallets.filter(
    (wallet) =>
      supportedWalletNames.includes(wallet.adapter.name) &&
      wallet.readyState === WalletReadyState.Installed
  );

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set loading state based on wallets
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    // Short timeout to allow the wallet state to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [wallets]);

  // Copy wallet address function
  const copyWalletAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading placeholder
  if (isLoading) {
    return (
      <div className="animate-pulse flex">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="flex items-center justify-center p-2 rounded-full bg-black/30 border-4 border-double border-gray-700 w-12 h-12"
          disabled
        >
          <div className="w-6 h-6 bg-gray-600 rounded-full opacity-50"/>
        </button>
      </div>
    );
  }

  // If user is connected, show wallet dropdown
  if (publicKey) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 border-4 border-double border-[#CEFF67] rounded-md bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
        >
          <Image
            src="/images/wallet.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-black border border-gray-800 rounded-md shadow-lg z-50">
            <div className="p-3 border-b border-gray-800">
              <p className="text-gray-400 text-xs mb-1">Your wallet</p>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-sm">
                  {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
                </p>
                <button
                  type="button"
                  onClick={copyWalletAddress}
                  className="p-1 hover:bg-gray-800 rounded-md"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-800 rounded-md text-white flex items-center"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If we have installed wallets, show either modal button or direct list
  if (filteredWallets.length > 0) {
    // For modal mode, render a button that opens the wallet selection modal
    if (isModal) {
      return (
        <>
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="p-2 border border-[#CEFF67] rounded-md bg-black flex items-center justify-center hover:bg-gray-900 hover:border-[#B9E94C] hover:shadow-lg hover:shadow-[#CEFF67]/20 transition-all"
          >
            <Image
              src="/images/wallet.svg"
              alt="Wallet"
              width={24}
              height={24}
              className="filter brightness-125"
            />
          </button>

          {/* Wallet Selection Modal */}
          <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
            <DialogContent className="sm:max-w-md bg-black border border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white text-center font-poppins">Choose Wallet</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-6 px-2">
                {filteredWallets.map((wallet) => (
                  <button
                    type="button"
                    key={wallet.adapter.name}
                    onClick={() => {
                      select(wallet.adapter.name);
                      setShowWalletModal(false);
                    }}
                    className="w-full px-8 py-4 bg-black border border-[#CEFF67] rounded-md hover:bg-gray-900 hover:border-[#B9E94C] hover:shadow-lg hover:shadow-[#CEFF67]/20 transition-all font-poppins font-medium text-sm flex items-center gap-4"
                  >
                    <div className="flex gap-2 items-center justify-center bg-white/10 rounded-full p-1.5 overflow-hidden">
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-6 h-6 rounded-full filter brightness-125"
                      />
                    </div>
                    <span className="text-white">Connect {wallet.adapter.name}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    // For direct mode (non-modal), render the wallet options directly
    return (
      <div className="flex flex-col w-full gap-2">
        {filteredWallets.map((wallet) => (
          <button
            type="button"
            key={wallet.adapter.name}
            onClick={() => select(wallet.adapter.name)}
            className="w-full px-4 py-2 bg-black border border-[#CEFF67] rounded-md hover:bg-gray-900 hover:border-[#B9E94C] hover:shadow-lg hover:shadow-[#CEFF67]/20 transition-all font-poppins text-sm flex items-center justify-center gap-2"
          >
            <div className="flex items-center justify-center rounded-full p-1 bg-white/10">
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-5 h-5 filter brightness-125"
              />
            </div>
            <span className="text-white">Connect {wallet.adapter.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // If no supported wallets are installed, show install message
  return (
    <div className="text-center w-full">
      <p className="text-[#CEFF67] mb-4 font-poppins">No supported wallets found</p>
      <div className="flex flex-col w-full gap-2">
        <a
          href="https://www.backpack.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 bg-black border border-[#CEFF67] rounded-md hover:bg-gray-900 hover:border-[#B9E94C] hover:shadow-lg hover:shadow-[#CEFF67]/20 transition-all font-poppins text-sm flex items-center justify-center"
        >
          <div className="flex items-center">
            <Image
              src="/images/wallet.svg"
              alt="Backpack Wallet"
              width={20}
              height={20}
              className="mr-2 filter brightness-125"
            />
            <span className="text-white">Install Backpack</span>
          </div>
        </a>
        <a
          href="https://nightly.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 bg-black border border-[#CEFF67] rounded-md hover:bg-gray-900 hover:border-[#B9E94C] hover:shadow-lg hover:shadow-[#CEFF67]/20 transition-all font-poppins text-sm flex items-center justify-center"
        >
          <div className="flex items-center">
            <Image
              src="/images/wallet.svg"
              alt="Nightly Wallet"
              width={20}
              height={20}
              className="mr-2 filter brightness-125"
            />
            <span className="text-white">Install Nightly</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { network } = useNetwork();
  const wallets = useMemo(() => [new NightlyWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={network.endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}