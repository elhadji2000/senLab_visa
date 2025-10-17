import React from "react";
import { Html } from "@react-three/drei";

export default function BaseLabel({ position, text }) {
  return (
    <Html position={position} center>
      <div className="bg-yellow-300 text-black px-2 py-1 rounded-md text-sm font-bold shadow-md">
        {text}
      </div>
    </Html>
  );
}
