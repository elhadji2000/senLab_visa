import React from "react";
import { Html } from "@react-three/drei";

export default function AxisLabels() {
  return (
    <>
      <Html position={[6, 0, 0]}>
        <span className="text-red-500 font-bold">X</span>
      </Html>
      <Html position={[0, 6, 0]}>
        <span className="text-green-600 font-bold">Y</span>
      </Html>
      <Html position={[0, 0, 6]}>
        <span className="text-blue-500 font-bold">Z</span>
      </Html>
    </>
  );
}
