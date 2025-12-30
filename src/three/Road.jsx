import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { roadConfig } from "../config/roadConfig";

export default function Road() {
  return (
    <>
      {roadConfig.map((r) => {
        const texture = useLoader(THREE.TextureLoader, r.texture);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(...r.repeat);

        return (
          <mesh
            key={r.id}
            position={r.position}
            rotation={r.rotation}
          >
            <planeGeometry args={r.size} />
            <meshStandardMaterial map={texture} />
          </mesh>
        );
      })}
    </>
  );
}
