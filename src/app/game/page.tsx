"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GameLandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to walk page if accessed directly
    router.push('/walk');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"/>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}