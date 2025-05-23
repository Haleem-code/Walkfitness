'use client';

import "../styles/globals.css";
import React, { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

import ClientOnly from "../components/ClientOnly";
import TopNavbar from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@/providers/WalletConnect";
import { NetworkProvider } from "@/hooks/useNetwork";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
   variable: '--font-poppins'
});

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const showNavbars = !["/logo", "/landing"].includes(pathname);

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
      <head>
        <link rel="icon" href="/images/logo2.svg" type="image/svg+xml" />
      </head>
      <body className={`bg-black min-h-screen flex flex-col ${poppins.variable}`}>
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
