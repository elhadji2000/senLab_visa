import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AxesHelper } from "three";
import Figure3D from "./components/Figure3D";
import AxisLabels from "./components/AxisLabels";

export default function GeometryScene({ figure }) {
  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />

      {/* Repère orthonormé */}
      <primitive object={new AxesHelper(5)} />
      <AxisLabels />

      <OrbitControls />

      <Figure3D type={figure} />
    </Canvas>
  );
}
