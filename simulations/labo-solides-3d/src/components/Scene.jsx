import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Scene = ({ shape, dimensions }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (shape === "cylinder" && meshRef.current) {
      const geometry = meshRef.current.geometry;
      geometry.clearGroups(); // Nettoyer les groupes précédents

      const count = geometry.index.count;

      // Face latérale : 0 → 64 (premier tiers)
      geometry.addGroup(0, 64 * 3, 0); // side
      // Face du haut
      geometry.addGroup(64 * 3, 32 * 3, 1); // top
      // Face du bas
      geometry.addGroup((64 + 32) * 3, 32 * 3, 2); // bottom
    }
  }, [shape, dimensions]);

  switch (shape) {
    case "cylinder":
      return (
        <mesh ref={meshRef}>
          <cylinderGeometry
            args={[dimensions.radius, dimensions.radius, dimensions.height, 32, 1, false]}
          />
          {[ "orange", "red", "blue" ].map((color, i) => (
            <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
          ))}
        </mesh>
      );

    case "cube":
      return (
        <mesh>
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
          {["red", "green", "blue", "orange", "purple", "yellow"].map((color, i) => (
            <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
          ))}
        </mesh>
      );

    case "sphere":
      return (
        <mesh>
          <sphereGeometry args={[dimensions.radius, 32, 32]} />
          <meshStandardMaterial color="#00bfff" />
        </mesh>
      );

    default:
      return null;
  }
};

export default Scene;
