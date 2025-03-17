import React from 'react';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';

type Rarity = 'Legendary' | 'Rare' | 'Epic' | 'Uncommon' | 'Common';

type SneakerCard = {
  id: string;
  rarity: Rarity;
  price: number;
  rarityPercentage: string;
  type: 'buy' | 'sell' | 'bid';
  imageColor: 'purple' | 'yellow' | 'orange' | 'green' | 'blue';
};

const getRarityColor = (rarity: Rarity): string => {
  const colors: Record<Rarity, string> = {
    Legendary: 'bg-purple-500',
    Rare: 'bg-yellow-500',
    Epic: 'bg-orange-500',
    Uncommon: 'bg-green-500',
    Common: 'bg-blue-500',
  };
  return colors[rarity];
};

export const MarketplaceCard: React.FC = () => {
  const sneakers: SneakerCard[] = [
    {
      id: '2525582387',
      rarity: 'Legendary',
      price: 150,
      rarityPercentage: '23.09%',
      type: 'bid',
      imageColor: 'purple',
    },
    {
      id: '468927318131',
      rarity: 'Rare',
      price: 80,
      rarityPercentage: '57.02%',
      type: 'buy',
      imageColor: 'yellow',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 relative flex items-center justify-center">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center">
        <span className="text-white font-bold text-2xl">Coming Soon...</span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-4 opacity-50">
        {sneakers.map((sneaker, index) => (
          <div key={`${sneaker.id}-${index}`} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className={`${getRarityColor(sneaker.rarity)} px-2 py-1 rounded text-xs`}>
                {sneaker.rarity}
              </span>
              <span className="text-xs">{sneaker.rarityPercentage}</span>
            </div>
            <div className="flex justify-center my-4">
              <Image src={"/images/sneaker-1.png"} width={200} height={200} alt="sneakers" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                <span>{sneaker.price}</span>
              </div>
              <button className="bg-blue-500 px-4 py-1 rounded text-sm">
                {sneaker.type.toUpperCase()}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2">#{sneaker.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
