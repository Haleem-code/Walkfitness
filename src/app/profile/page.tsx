// pages/index.tsx
"use client";
import React from "react";
import Profile from "../../components/Profile";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <Profile />
    </div>
  );
};

export default Home;
