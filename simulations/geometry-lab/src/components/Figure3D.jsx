import React from "react";
import BaseLabel from "./BaseLabel";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";

export default function Figure3D({ type }) {
  // 🎨 Définition des matériaux colorés pour plusieurs faces
  const cubeMaterials = [
    <meshStandardMaterial attach="material-0" color="red" />,
    <meshStandardMaterial attach="material-1" color="green" />,
    <meshStandardMaterial attach="material-2" color="blue" />,
    <meshStandardMaterial attach="material-3" color="yellow" />,
    <meshStandardMaterial attach="material-4" color="orange" />,
    <meshStandardMaterial attach="material-5" color="purple" />,
  ];

  const parallelepipedMaterials = [
    <meshStandardMaterial attach="material-0" color="lightblue" />,
    <meshStandardMaterial attach="material-1" color="lightgreen" />,
    <meshStandardMaterial attach="material-2" color="pink" />,
    <meshStandardMaterial attach="material-3" color="lightcoral" />,
    <meshStandardMaterial attach="material-4" color="khaki" />,
    <meshStandardMaterial attach="material-5" color="plum" />,
  ];

  if (type === "cube") {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        {cubeMaterials}
        <BaseLabel position={[0, -1.3, 1]} text="Côté" />
      </mesh>
    );
  }

  if (type === "parallelepiped") {
    return (
      <mesh>
        <boxGeometry args={[4, 2, 2]} />
        {parallelepipedMaterials}
        <BaseLabel position={[0, -1.3, 1]} text="coté" />
      </mesh>
    );
  }

  if (type === "sphere") {
    return (
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="skyblue" opacity={0.7} transparent />
        <BaseLabel position={[0, -2.2, 0]} text="Rayon" />
      </mesh>
    );
  }

  if (type === "cone") {
    const apex = [0, 2, 0]; // sommet du cône
    const baseY = -2;
    const radius = 2;

    // Points principaux de la base (4 pour tracer les génératrices facilement)
    const base = [
      [radius, baseY, 0],
      [0, baseY, radius],
      [-radius, baseY, 0],
      [0, baseY, -radius],
    ];

    return (
      <group>
        {/* Surface latérale */}
        <mesh>
          <coneGeometry args={[radius, 4, 64, 1, true]} />{" "}
          {/* true => pas de base */}
          <meshStandardMaterial
            color="pink"
            opacity={0.5} // un peu plus transparent
            transparent
            side={THREE.DoubleSide} // visible des deux côtés
          />
        </mesh>

        {/* Base du cône */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY, 0]}>
          <circleGeometry args={[radius, 64]} />
          <meshStandardMaterial
            color="red"
            opacity={0.95} // plus opaque pour bien la voir
            transparent
            side={THREE.DoubleSide} // toujours visible en rotation
          />
        </mesh>

        {/* Contour de la base */}
        <Line
          points={Array.from({ length: 65 }, (_, i) => [
            Math.cos((i / 64) * 2 * Math.PI) * radius,
            baseY,
            Math.sin((i / 64) * 2 * Math.PI) * radius,
          ])}
          color="blue"
          lineWidth={2}
        />

        {/* Génératrices */}
        {base.map((point, i) => (
          <Line key={i} points={[apex, point]} color="blue" lineWidth={2} />
        ))}

        {/* Hauteur */}
        <Line points={[[0, baseY, 0], apex]} color="red" lineWidth={2} />
        <Html position={[0.5, 2.3, 0]}>
          <span className="bg-red-200 px-1 rounded text-xs">Hauteur</span>
        </Html>

        {/* Sommet (petite sphère pour marquer l’extrémité) */}
        <mesh position={apex}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <BaseLabel position={[0, -2.3, 1]} text="Base" />
      </group>
    );
  }

  if (type === "pyramid") {
    const apex = [0, 1.5, 0]; // sommet
    const baseY = -1.5;
    const base = [
      [2, baseY, 0], // point avant
      [0, baseY, 2], // gauche
      [-2, baseY, 0], // arrière
      [0, baseY, -2], // droite
    ];

    return (
      <group>
        {/* Faces latérales */}
        <mesh>
          <coneGeometry args={[2, 3, 4, 1, true]} /> {/* true = pas de base */}
          <meshStandardMaterial
            color="purple"
            opacity={0.6}
            transparent
            side={2}
          />
        </mesh>

        {/* Base séparée */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, baseY, 0]}>
          <circleGeometry args={[2, 4]} />
          <meshStandardMaterial color="yellow" opacity={0.8} transparent />
        </mesh>

        {/* Arêtes latérales */}
        {base.map((point, i) => (
          <Line
            key={`edge-${i}`}
            points={[apex, point]}
            color="blue"
            lineWidth={2}
          />
        ))}

        {/* Arêtes de la base */}
        {base.map((point, i) => (
          <Line
            key={`base-${i}`}
            points={[point, base[(i + 1) % base.length]]}
            color="blue"
            lineWidth={2}
          />
        ))}

        <BaseLabel position={[0, -1.8, 1]} text="Base" />

        {/* Hauteur */}
        <Line points={[[0, baseY, 0], apex]} color="red" lineWidth={2} />
        <Html position={[0, 1.8, 0]}>
          <span className="bg-red-200 px-1 rounded text-xs">Hauteur</span>
        </Html>
      </group>
    );
  }

  return null;
}
