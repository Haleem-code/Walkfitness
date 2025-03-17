"use client";

import "../styles/globals.css";
import React, { type ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ClientOnly from "../components/ClientOnly";
import TopNavbar from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { Poppins } from '@next/font/google';
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@/providers/WalletConnect";
import { NetworkProvider } from "@/hooks/useNetwork";
// import { auth } from "@/backend/auth"; 

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const showNavbars = pathname !== "/logo" && pathname !== "/landing";

  const [pointData, setPointData] = useState<number | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/getpoints");
        const data = await response.json();
        setPointData(data.points || 0);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };
    fetchPoints();
  }, []);

  return (
    <html lang="en">
      <link rel="icon" href="/images/logo2.svg" type="image/svg+xml" />
      <body style={poppins.style} className={`bg-black min-h-screen flex flex-col ${poppins.className}`}>
        <NetworkProvider>
          <WalletProvider>
            <SessionProvider>
              <ClientOnly>
                {showNavbars && <TopNavbar points={pointData ?? 0} />}
                <main className="flex-grow">{children}</main>
                {showNavbars && <BottomNav />}
              </ClientOnly>
            </SessionProvider>
          </WalletProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
