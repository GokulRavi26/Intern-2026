import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import InfoPanel from "./InfoPanel";
import { useRandomMachineData } from "../data/useRandomMachineData";


export default function Machine({ id, model, position, rotation, scale, status }) {
  const { scene } = useGLTF(model);
  const clonedScene = scene.clone(true);

  const machineData = useRandomMachineData(id); // 🔥 RANDOM LIVE DATA

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);
  }, [clonedScene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
      <InfoPanel data={machineData} />
    </group>
  );
}
