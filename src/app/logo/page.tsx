"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LogoPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#C0B6FF" }}
    >
      <Image 
        src="/images/logo2.svg"
        alt="Logo"
        width={200} 
        height={200}
      />
    </div>
  );
};

export default LogoPage;
