"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Image from "next/image";
import "react-circular-progressbar/dist/styles.css";

type DailyProgressBarProps = {
  //totalSteps: number;
  stepsForLastUpdate: number;
};

const DailyProgressBar: React.FC<DailyProgressBarProps> = ({ stepsForLastUpdate }) => {
  const maxSteps = 15000; // Default max steps
  const percentage = (stepsForLastUpdate / maxSteps) * 100;

  return (
    <div className="relative flex flex-col items-center">
      <div style={{ width: 200, height: 200 }}>
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: "#4ade80",
            trailColor: "#C0B6FF",
          })}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"style={{marginTop:"-1rem"}}>
          <Image
            src="/images/sneaker.svg"
            alt="Sneaker"
            width={180} 
            height={180} 
            layout="intrinsic" 
          />
        </div>
      </div>
              <div className="text-center mt-4  text-white">   {stepsForLastUpdate} / {maxSteps} <span className="text-[#4ade80]">steps</span></div>
    </div>
  );
};

export default DailyProgressBar;
