"use client";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { WalletModal } from './WalletModal';


const TopNavbar: FC = () => {
  const router = useRouter();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  
  // Example wallet data - replace with actual user data
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const [balance, setBalance] = useState(1250.75);
  const username = 'walker123'; // Replace with actual username from auth context

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
            width={120} 
            height={48}
            priority 
          />
        </div>
        <div>
          <Button
            onClick={() => setIsWalletOpen(true)}
            variant="outline"
            className="h-10 px-4 bg-white hover:bg-gray-50 text-[#0F172A] border-[#E2E8F0] hover:border-[#CBD5E1]"
          >
            <Wallet className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Wallet</span>
          </Button>
        </div>
      </nav>

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        walletAddress={walletAddress}
        balance={balance}
        username={username}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    </>
  );
};

export default TopNavbar;
