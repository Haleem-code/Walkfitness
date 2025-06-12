'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';

interface DepositQRCodeProps {
    address: string;
    size?: number;
}

export function DepositQRCode({ address, size = 256 }: DepositQRCodeProps) {
    const logoSize = Math.floor(size * 0.4); // Logo will be 20% of QR code size
    const logoPosition = (size - logoSize) / 2;

    return (
        <div className="relative">
            <QRCodeSVG
                value={address}
                size={size}
                level="H" // High error correction
                includeMargin={false}
                className="rounded-lg"
            />
            <div
                className="absolute flex items-center justify-center bg-white rounded-md"
                style={{
                    width: `${logoSize}px`,
                    height: `${logoSize}px`,
                    top: `${logoPosition}px`,
                    left: `${logoPosition}px`,
                }}
            >
                <Image
                    src="/images/logo2.svg"
                    alt="Logo"
                    width={logoSize * 0.7}
                    height={logoSize * 0.7}
                    className="p-1 invert"
                />
            </div>
        </div>
    );
}
