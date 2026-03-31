"use client";

import { useEffect } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <p className="font-display italic text-white text-[clamp(28px,5vw,42px)] animate-pulse-slow">
        Figuring you out&hellip;
      </p>
    </div>
  );
}
