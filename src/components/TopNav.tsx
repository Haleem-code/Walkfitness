"use client";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TopNavbarProps {
 
}

const TopNavbar: FC<TopNavbarProps> = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
      <div className="flex items-center">
        <Image 
          src="/images/logo2.svg" 
          alt="Company Logo" 
          width={120} 
          height={48}
          priority 
        />
      </div>
      <div>
        <button
          onClick={() => router.push("/profile")}
          className="text-white mr-4"
          aria-label="Go to profile"
        >
          <Image
            src="/images/profileImg.svg"
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full cursor-pointer border"
          />
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
