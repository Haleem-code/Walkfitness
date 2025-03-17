"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Image from "next/image";
import "react-circular-progressbar/dist/styles.css";

type DailyProgressBarProps = {
  totalSteps: number;
};

const DailyProgressBar: React.FC<DailyProgressBarProps> = ({ totalSteps }) => {
  const maxSteps = 10000; // Default max steps
  const percentage = (totalSteps / maxSteps) * 100;

  return (
    <div className="relative flex flex-col items-center">
      <div style={{ width: 250, height: 250 }}>
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: "#6a1b9a",
            trailColor: "#d6d6d6",
          })}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"style={{marginTop:"-1rem"}}>
          <Image
            src="/images/sneaker.svg"
            alt="Sneaker"
            width={180} // Adjust size as needed
            height={180} // Adjust size as needed
            layout="intrinsic" // Adjust layout based on your needs
          />
        </div>
      </div>
      <div className="text-center mt-4 text-xl text-white">{totalSteps} Steps</div>
    </div>
  );
};

export default DailyProgressBar;
