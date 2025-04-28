"use client";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/background-animation.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{
        position: "absolute",
        zIndex: 0,
      }}
    />
  );
}
