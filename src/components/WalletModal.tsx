'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { useUserWallet } from '@/hooks/useUserWallet';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
    balance?: number;
    username?: string;
    onDeposit: () => void;
    onWithdraw: () => void;
}

// Initialize Solana connection to devnet
import { clusterApiUrl } from '@solana/web3.js';
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export function WalletModal({
    isOpen,
    onClose,
    walletAddress: propWalletAddress,
    balance: propBalance = 0,
    onDeposit,
    onWithdraw,
}: WalletModalProps) {
    const [copied, setCopied] = useState(false);
    const [balance, setBalance] = useState<number>(propBalance);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [balanceError, setBalanceError] = useState<string | null>(null);
    const [solPrice, setSolPrice] = useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const { wallet, isLoading, error } = useUserWallet();
    const walletAddress = wallet?.address || propWalletAddress || '';
    
    // Fetch SOL price from Binance API
    const fetchSolPrice = useCallback(async () => {
        setIsLoadingPrice(true);
        setPriceError(null);
        
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
            if (!response.ok) {
                throw new Error('Failed to fetch SOL price');
            }
            const data = await response.json();
            setSolPrice(Number.parseFloat(data.price));
        } catch (err) {
            console.error('Error fetching SOL price:', err);
            setPriceError('Failed to load price data');
        } finally {
            setIsLoadingPrice(false);
        }
    }, []);
    
    // Fetch price when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchSolPrice();
            // Refresh price every 30 seconds
            const interval = setInterval(fetchSolPrice, 30000);
            return () => clearInterval(interval);
        }
    }, [isOpen, fetchSolPrice]);
    
    // Fetch Solana balance when wallet address changes or modal opens
    const fetchBalance = useCallback(async () => {
        if (!walletAddress) return;
        
        setIsLoadingBalance(true);
        setBalanceError(null);
        
        try {
            const publicKey = new PublicKey(walletAddress);
            const balanceInLamports = await connection.getBalance(publicKey);
            const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
            setBalance(Number.parseFloat(balanceInSOL.toFixed(4)));
        } catch (err) {
            console.error('Error fetching balance:', err);
            setBalanceError('Failed to fetch balance');
            setBalance(0);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [walletAddress]);
    
    // Fetch balance when modal opens or wallet address changes
    useEffect(() => {
        if (isOpen && walletAddress) {
            fetchBalance();
        }
    }, [isOpen, walletAddress, fetchBalance]);

    const handleCopyAddress = () => {
        if (!walletAddress) return;
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shortenAddress = (address: string) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };
    
    const displayBalance = isLoadingBalance ? 'Loading...' : balanceError ? 'Error' : balance;
    const displayUsdValue = isLoadingPrice || priceError || solPrice === null 
        ? (priceError ? 'Price data unavailable' : 'Loading price...')
        : `≈ $${(balance * solPrice).toFixed(2)} USD`;

    const modalContent = (
        <div className="p-6 text-white">
            {/* Balance Card */}
            <div className="relative bg-gradient-to-r from-purple-900/40 to-purple-600/30 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
                <p className="text-sm text-purple-300 mb-1">Your Balance</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {typeof displayBalance === 'number' ? displayBalance.toFixed(4) : displayBalance}
                    </span>
                    <span className="text-purple-300 text-lg">SOL</span>
                </div>
                {displayUsdValue && (
                    <div className="mt-2 text-sm text-purple-200">
                        {displayUsdValue}
                    </div>
                )}
                {balanceError && (
                    <div className="mt-2 text-sm text-red-400">
                        {balanceError}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <Button
                    onClick={onDeposit}
                    className="flex-1 h-14 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl"
                >
                    <ArrowDownLeft className="w-5 h-5" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Deposit</div>
                        <div className="text-sm font-medium">Add Funds</div>
                    </div>
                </Button>
                <Button
                    onClick={onWithdraw}
                    className="flex-1 h-14 gap-2 bg-gradient-to-r from-purple-900/40 to-purple-800/40 hover:from-purple-800/60 hover:to-purple-700/60 text-white rounded-xl border border-purple-500/30"
                >
                    <ArrowUpRight className="w-5 h-5" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Withdraw</div>
                        <div className="text-sm font-medium">Cash Out</div>
                    </div>
                </Button>
            </div>

            {/* Wallet Address */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-purple-300 mb-2">WALLET ADDRESS</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                <span className="text-sm text-purple-300">Loading wallet...</span>
                            </div>
                        ) : walletAddress ? (
                            <span className="font-mono text-sm text-white truncate max-w-[220px] bg-black/20 px-3 py-1.5 rounded-md">
                                {walletAddress}
                            </span>
                        ) : (
                            <span className="text-sm text-red-400">
                                {error?.message || 'No wallet address available'}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyAddress}
                            className="w-8 h-8 text-purple-300 hover:bg-purple-900/50 hover:text-white"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="sr-only">{copied ? 'Copied!' : 'Copy address'}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="w-8 h-8 text-purple-300 hover:bg-purple-900/50 hover:text-white"
                        >
                            <a
                                href={`https://explorer.solana.com/address/${walletAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View on Solana Explorer"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent className="max-h-[90vh] rounded-t-2xl bg-gradient-to-b from-purple-950 to-black border-t border-purple-900/30">
                    <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10 pointer-events-none" />
                    <DrawerHeader className="px-6 pt-6 pb-2 relative text-center">
                        <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Wallet
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-6 pb-8 relative">
                        {modalContent}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-purple-950 to-black border border-purple-900/30 rounded-2xl">
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10 pointer-events-none rounded-2xl" />
                <DialogHeader className="px-6 pt-6 pb-2 relative text-center">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Wallet
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6 relative">
                    {modalContent}
                </div>
            </DialogContent>
        </Dialog>
    );
}
