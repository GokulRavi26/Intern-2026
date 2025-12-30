import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { deskConfig } from "../config/deskConfig";

export default function Desk() {
  return (
    <>
      {deskConfig.map((d) => {
        const { scene } = useGLTF(d.model);
        const clonedScene = useMemo(() => scene.clone(true), [scene]);

        useEffect(() => {
          let mesh = null;
          clonedScene.traverse((child) => {
            if (child.isMesh && !mesh) mesh = child;
          });
          if (!mesh) return;

          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3());

          mesh.position.sub(center);
          mesh.position.y -= box.min.y;
        }, [clonedScene]);

        return (
          <group
            key={d.id}
            position={d.position}
            rotation={d.rotation}
            scale={d.scale}
          >
            <primitive object={clonedScene} />
          </group>
        );
      })}
    </>
  );
}
