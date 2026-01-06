// src/three/Road.jsx
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { roadConfig } from "../config/roadConfig";

export default function Road() {

  // ✅ Load all textures at once
  const textures = useLoader(
    THREE.TextureLoader,
    roadConfig.map(r => r.texture)
  );

  textures.forEach((tex, i) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(...roadConfig[i].repeat);
  });

  return (
    <>
      {roadConfig.map((r, index) => (
        <mesh
          key={`road-${r.id}`}   // ✅ guaranteed unique
          position={r.position}
          rotation={r.rotation}
        >
          <planeGeometry args={r.size} />
          <meshStandardMaterial map={textures[index]} />
        </mesh>
      ))}
    </>
  );
}
