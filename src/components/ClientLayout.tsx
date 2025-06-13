'use client';

import React, { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ClientOnly from "./ClientOnly";
import TopNavbar from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { WalletProvider } from "@/providers/WalletConnect";
import { NetworkProvider } from "@/hooks/useNetwork";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showNavbars, setShowNavbars] = useState(true);
  const [pointData, setPointData] = useState<number | null>(null);

  useEffect(() => {
    setShowNavbars(!["/landing", "/authpage", "/", "/logo", "/about-us-page", "/community-page", "/privacy", "/marketplace-page", "/tournament-page"].some((path) => pathname === path))
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
  );
}