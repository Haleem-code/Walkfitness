'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { NEXT_PUBLIC_RPC_URL } from '@/config';
import { DepositQRCode } from './DepositQRCode';
import { useUserWallet } from '@/hooks/useUserWallet';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
    onDeposit: () => void;
    onWithdraw: (address: string, amount: number) => void;
}

const connection = new Connection(NEXT_PUBLIC_RPC_URL, 'confirmed');

type WithdrawInputs = {
    withdrawAddress: string;
    withdrawAmount: string;
};

export function WalletModal({
    isOpen,
    onClose,
    walletAddress,
    onWithdraw,
}: WalletModalProps) {
    type ViewType = 'MAIN' | 'DEPOSIT' | 'WITHDRAW';
    const [currentView, setCurrentView] = useState<ViewType>('MAIN');
    const [copied, setCopied] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');



    // React Query: fetch ETH balance
    const {
        data: balance,
        isLoading: isLoadingBalance,
        error: balanceError,
    } = useQuery({
        queryKey: ['balance', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return 0;
            try {
                const pubkey = new PublicKey(walletAddress);
                const lamports = await connection.getBalance(pubkey);
                return lamports / LAMPORTS_PER_SOL;
            } catch (error) {
                console.error('Error fetching balance:', error);
                return 0;
            }
        },
        enabled: !!walletAddress,
        refetchInterval: 3000,
    });

    // React Query: fetch ETH price
    const {
        data: ethPrice,
        isLoading: isLoadingPrice,
        error: priceError,
    } = useQuery({
        queryKey: ['ethPrice'],
        queryFn: async () => {
            const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
            if (!res.ok) throw new Error('Failed to fetch price');
            const data = await res.json();
            return Number.parseFloat(data.price);
        },
        refetchInterval: 30000,
    });

    const handleCopyAddress = () => {
        if (!walletAddress) return;
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shorten = (addr: string) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';


    const displayBalance = isLoadingBalance
        ? 'Loading...'
        : balanceError
            ? 'Error'
            : balance?.toFixed(4) ?? '0.0000';

    const displayUsdValue =
        isLoadingPrice || priceError || ethPrice == null
            ? priceError
                ? 'Price unavailable'
                : 'Loading price...'
            : `≈ $${((balance || 0) * ethPrice).toFixed(2)} USD`;

    // React Hook Form for withdrawal
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<WithdrawInputs>({
        mode: "onSubmit",
        defaultValues: {
            withdrawAddress: '',
            withdrawAmount: ''
        }
    });

    // Watch the input values to prevent re-renders from breaking input focus

    const onSubmit = async (data: WithdrawInputs) => {
        if (!walletAddress) return;

        setIsWithdrawing(true);
        setWithdrawError(null);
        setWithdrawSuccess(false);

        try {
            const amount = Number.parseFloat(data.withdrawAmount);
            const response = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    recipient: data.withdrawAddress
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Withdrawal failed');
            }

            setWithdrawSuccess(true);
            // Call the parent's onWithdraw for any additional handling
            onWithdraw(data.withdrawAddress, amount);

            // Reset form after successful withdrawal
            setValue('withdrawAmount', '');
            setValue('withdrawAddress', '');

            // Return to main view after a delay
            setTimeout(() => {
                setCurrentView('MAIN');
                setWithdrawSuccess(false);
            }, 2000);

        } catch (error) {
            console.error('Withdrawal error:', error);
            setWithdrawError(error instanceof Error ? error.message : 'Failed to process withdrawal');
        } finally {
            setIsWithdrawing(false);
        }
    };

    const MainView = () => (
        <div className="p-6 text-white">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-4">
                Manage Wallet
            </h2>

            <div className="relative bg-gradient-to-r from-purple-900/40 to-purple-600/30 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/10">
                <p className="text-sm text-purple-300 mb-1">Your Balance</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        {displayBalance}
                    </span>
                    <span className="text-purple-300 text-lg">ETH</span>
                </div>
                <div className="mt-2 text-sm text-purple-200">{displayUsdValue}</div>
            </div>

            <div className="flex gap-3 mb-6">
                <Button
                    onClick={() => setCurrentView('DEPOSIT')}
                    className="flex-1 h-14 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl"
                >
                    <ArrowDownLeft className="w-5 h-5" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Deposit</div>
                        <div className="text-sm font-medium">Add Funds</div>
                    </div>
                </Button>
                <Button
                    onClick={() => setCurrentView('WITHDRAW')}
                    className="flex-1 h-14 gap-2 bg-gradient-to-r from-purple-900/40 to-purple-800/40 hover:from-purple-800/60 hover:to-purple-700/60 text-white rounded-xl border border-purple-500/30"
                >
                    <ArrowUpRight className="w-5 h-5" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Withdraw</div>
                        <div className="text-sm font-medium">Cash Out</div>
                    </div>
                </Button>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-purple-300 mb-2">WALLET ADDRESS</p>
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-white truncate max-w-[220px] bg-black/20 px-3 py-1.5 rounded-md">
                        {walletAddress ? shorten(walletAddress) : 'Loading...'}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                            <Copy />
                            <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a
                                href={walletAddress ? `https://explorer.solana.com/address/${walletAddress}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const DepositView = () => (
        <div className="p-6 text-white">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView('MAIN')}>
                    <ArrowLeft />
                </Button>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                    Deposit ETH
                </h2>
            </div>
            <div className="flex flex-col items-center space-y-6">
                <div className="p-4 bg-white/5 rounded-xl">
                    {walletAddress ? (
                        <DepositQRCode address={walletAddress} size={220} />
                    ) : (
                        <div className="w-[220px] h-[220px] bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Loading QR Code...</span>
                        </div>
                    )}
                </div>
                <div className="w-full bg-black/20 p-4 rounded-xl">
                    <p className="text-xs text-purple-300 mb-2">WALLET ADDRESS</p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-white break-all pr-2">
                            {walletAddress || 'Loading address...'}
                        </span>
                        <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                            <Copy />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const WithdrawView = () => (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 text-white space-y-4">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView('MAIN')}>
                    <ArrowLeft />
                </Button>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                    Withdraw ETH
                </h2>
            </div>

            <div className="space-y-2">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm text-purple-300">Recipient Address</label>
                <input
                    {...register('withdrawAddress', { required: 'Address required' })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                    placeholder="Enter recipient address"
                />
                {errors.withdrawAddress && <p className="text-xs text-red-400">{errors.withdrawAddress.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label className="text-sm text-purple-300">Amount</label>
                    <span className="text-xs text-purple-300">Balance: {balance?.toFixed(4) || '0.0000'}</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        step="0.0001"
                        {...register('withdrawAmount', {
                            required: 'Amount required',
                            validate: v => Number.parseFloat(v) > 0 || 'Must be > 0'
                        })}

                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white pr-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                        placeholder="0.00"
                    />
                    <button
                        type="button"
                        onClick={() => setValue('withdrawAmount', (balance || 0).toString())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600/70 text-xs px-3 py-1.5 rounded-md hover:bg-purple-500/80 transition-colors"
                    >
                        MAX
                    </button>
                </div>
                {errors.withdrawAmount && <p className="text-xs text-red-400">{errors.withdrawAmount.message}</p>}
            </div>

            {withdrawError && (
                <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-lg">
                    {withdrawError}
                </div>
            )}
            {withdrawSuccess && (
                <div className="text-green-400 text-sm p-3 bg-green-900/30 rounded-lg">
                    Withdrawal successful!
                </div>
            )}
            <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-colors"
                disabled={!isValid || isWithdrawing}
            >
                {isWithdrawing ? 'Processing...' : 'Withdraw'}
            </Button>
        </form>
    );

    const content =
        currentView === 'DEPOSIT' ? <DepositView /> :
            currentView === 'WITHDRAW' ? <WithdrawView /> : <MainView />;

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent className="max-h-[90vh] rounded-t-2xl bg-gradient-to-b from-purple-950 to-black border-t border-purple-900/30">
                    <DrawerHeader>

                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-purple-950 to-black border border-purple-900/30 rounded-2xl">
                <DialogHeader className="px-6 pt-6 pb-2 text-center">

                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}
