'use client';

import "../styles/globals.css";
import React, { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

import ClientOnly from "../components/ClientOnly";
import TopNavbar from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@/providers/WalletConnect";
import { NetworkProvider } from "@/hooks/useNetwork";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-poppins'
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [showNavbars, setShowNavbars] = useState(true);
  const [pointData, setPointData] = useState<number | null>(null);

 useEffect(() => {
    setShowNavbars(!["/landing", "/authpage", "/", "/logo","/about-us-page","/community-page","/privacy","/marketplace-page","/tournament-page"].some((path) => pathname === path))
  }, [pathname])

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
        <QueryClientProvider client={queryClient}>
          <NetworkProvider>
           
              <SessionProvider>
                <ClientOnly>
                  {showNavbars && <TopNavbar />}
                  <main className="flex-grow">{children}</main>
                  {showNavbars && <BottomNav />}
                </ClientOnly>
              </SessionProvider>
          
          </NetworkProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
