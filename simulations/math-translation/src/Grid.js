import { Plane, Text } from "@react-three/drei";

const XZPlane = ({ size }) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[1.5 * Math.PI, 0, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial
      attach="material"
      color="yellow" // gris neutre
      wireframe
      opacity={0.6}
      transparent
    />
  </Plane>
);

const XYPlane = ({ size }) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, 0, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial
      attach="material"
      color="blue" // gris plus foncé
      wireframe
      opacity={0.6}
      transparent
    />
  </Plane>
);

const YZPlane = ({ size }) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, Math.PI / 2, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial
      attach="material"
      color="red" // gris encore plus sombre
      wireframe
      opacity={0.6}
      transparent
    />
  </Plane>
);

export default function Grid({ size }) {
  return (
    <group>
      <Text color="white" anchorX="center" anchorY="middle" position={[size / 2 + 1, 0, 0]} scale={[4, 4, 4]}>
        x+
      </Text>
      <Text color="white" anchorX="center" anchorY="middle" position={[-size / 2 - 1, 0, 0]} scale={[4, 4, 4]}>
        x-
      </Text>
      <Text color="blue" anchorX="center" anchorY="middle" position={[0, size / 2 + 1, 0]} scale={[4, 4, 4]}>
        y+
      </Text>
      <Text color="blue" anchorX="center" anchorY="middle" position={[0, -size / 2 - 1, 0]} scale={[4, 4, 4]}>
        y-
      </Text>
      <Text color="red" anchorX="center" anchorY="middle" position={[0, 0, size / 2 + 1]} scale={[4, 4, 4]}>
        z+
      </Text>
      <Text color="red" anchorX="center" anchorY="middle" position={[0, 0, -size / 2 - 1]} scale={[4, 4, 4]}>
        z-
      </Text>

      <XZPlane size={size} />
      <XYPlane size={size} />
      <YZPlane size={size} />
    </group>
  );
}
