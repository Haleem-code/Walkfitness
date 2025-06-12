"use client";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { WalletModal } from './WalletModal';
import { useUserWallet } from "@/hooks/useUserWallet";


const TopNavbar: FC = () => {
  const router = useRouter();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const { wallet, isLoading: isWalletLoading } = useUserWallet();

  const handleDeposit = () => {
    console.log('Deposit clicked');
    // Implement deposit logic
  };

  const handleWithdraw = () => {
    console.log('Withdraw clicked');
    // Implement withdraw logic
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <div className="flex items-center">
          <Image
            src="/images/logo2.svg"
            alt="Walkfit Logo"
            width={60}
            height={50}
            priority
          />
        </div>
        <div>
          <Button
            onClick={() => setIsWalletOpen(true)}
            className="h-11 px-5 bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-xl transition-colors duration-200"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-semibold">Wallet</span>
          </Button>
        </div>
      </nav>

      {isWalletLoading ? (
        <div />
      ) : <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        walletAddress={wallet?.address}

        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />}


    </>
  );
};

export default TopNavbar;
