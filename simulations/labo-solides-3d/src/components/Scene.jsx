import React from "react";

const Scene = ({ shape, dimensions }) => {
  let geometry = null;

  switch (shape) {
    case "cube":
      geometry = <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[dimensions.radius, 32, 32]} />;
      break;
    case "cylinder":
      geometry = <cylinderGeometry args={[dimensions.radius, dimensions.radius, dimensions.height, 32]} />;
      break;
    default:
      geometry = null;
  }

  return (
    <mesh>
      {geometry}
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
};

export default Scene;
