import { APP_URL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface WalletData {
    address: string;
    userId: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const useUserWallet = () => {
    const { data: session } = useSession();

    // Fetch wallet data
    const { data: wallet, isLoading, error, refetch } = useQuery<WalletData | null>({
        queryKey: ['wallet'],
        queryFn: async () => {
            console.log('Fetching wallet data...');
            if (!session?.user?.email) {
                console.log('No session email, skipping wallet fetch');
                return null;
            }

            try {
                const response = await fetch(`/api/wallet`);
                if (!response.ok) {
                    throw new Error('Failed to fetch wallet');
                }
                const data = await response.json();
                console.log('Wallet data:', data);
                return data;
            } catch (err) {
                console.error('Error fetching wallet:', err);
                throw err;
            }
        },
        enabled: !!session?.user?.email,
    });

    return {
        wallet,
        isLoading,
        error,
        refetch,
    };
};