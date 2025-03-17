import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { CustomWalletMultiButton } from "@/providers/WalletConnect";

interface TopNavbarProps {
  points: number | null; // The points prop
}

const TopNavbar: React.FC<TopNavbarProps> = ({ points }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [pointData, setPointData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const fetchPointData = async () => {
    try {
      const emailRes = await fetch("/api/getEmail");
      const { email } = await emailRes.json();
      console.log("email", email);

      if (email) {
        const res = await fetch(`/api/getpoints?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.points !== undefined) {
            setPointData(data.points);
          } else {
            console.error("Points data not found in response");
          }
        } else {
          console.error("Failed to fetch points data:", res.statusText);
        }
      } else {
        console.error("Email not found");
      }
    } catch (error) {
      console.error("Error fetching points data:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchPointData();
  }, []);

  const showNavbar = !['/logo', '/landing', '/authpage', '/'].includes(pathname);

  if (!showNavbar) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black flex justify-between items-center p-4 border-b border-white z-10">
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={handleBack} className="text-white">
        <Image src="/images/back-btn.svg" alt="Back Button" width={48} height={48} />
      </button>
      <div className="flex items-center space-x-4">
        <div className="text-white border-4 border-double border-[#C0B6FF] p-3">
          {loading ? "Loading..." : (pointData !== null ? `${pointData} WLK` : "0 WLK")}
        </div>
      </div>
      <div>
        <CustomWalletMultiButton isModal/>
      </div>
    </nav>
  );
};

export default TopNavbar;
