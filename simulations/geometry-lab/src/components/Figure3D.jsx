import React from "react";
import BaseLabel from "./BaseLabel";
import { Line, Html } from "@react-three/drei";

export default function Figure3D({ type }) {
  if (type === "triangle") {
    return (
      <group>
        <mesh>
          <coneGeometry args={[2, 3, 3]} />
          <meshStandardMaterial color="lightblue" opacity={0.6} transparent />
        </mesh>
        <BaseLabel position={[0, -1.6, 1]} text="Base" />

        {/* Hauteur */}
        <Line
          points={[
            [0, -1.5, 0],
            [0, 1.5, 0],
          ]}
          color="red"
          lineWidth={3}
        />
        <Html position={[0, 1.6, 0]}>
          <span className="bg-red-200 px-1 rounded text-xs">Hauteur</span>
        </Html>
      </group>
    );
  }

  if (type === "rectangle") {
    return (
      <mesh>
        <boxGeometry args={[4, 2, 2]} />
        <meshStandardMaterial color="lightgreen" opacity={0.8} transparent />
        <BaseLabel position={[0, -0.3, 1]} text="Base" />
      </mesh>
    );
  }

  if (type === "square") {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" opacity={0.8} transparent />
        <BaseLabel position={[0, -0.3, 1]} text="coté" />
      </mesh>
    );
  }

  if (type === "pyramid") {
    return (
      <group>
        <mesh>
          <coneGeometry args={[2, 3, 4]} />
          <meshStandardMaterial color="pink" opacity={0.6} transparent />
        </mesh>
        <BaseLabel position={[0, -1.6, 1]} text="Base" />

        {/* Hauteur */}
        <Line
          points={[
            [0, -1.5, 0],
            [0, 1.5, 0],
          ]}
          color="red"
          lineWidth={3}
        />
        <Html position={[0, 1.6, 0]}>
          <span className="bg-red-200 px-1 rounded text-xs">Hauteur</span>
        </Html>
      </group>
    );
  }

  return null;
}
