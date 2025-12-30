// src/three/Machine.jsx
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import InfoPanel from "./InfoPanel";
import { useRabbitMQMachineData } from "../data/useRabbitMQMachineData";

export default function Machine({ id, model, position, rotation, scale }) {
  const { scene } = useGLTF(model);
  const clonedScene = scene.clone(true);
  const navigate = useNavigate();

  // Use RabbitMQ data hook instead of MQTT
  const { data: machineData, isConnected } = useRabbitMQMachineData(id);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);
  }, [clonedScene]);

  // Visual indicator based on connection status
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (!isConnected) {
          // Dim the machine if not connected
          child.material = child.material.clone();
          child.material.opacity = 0.5;
          child.material.transparent = true;
        } else {
          // Restore normal appearance
          child.material.opacity = 1;
          child.material.transparent = false;
        }
      }
    });
  }, [isConnected, clonedScene]);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/machine/${id}`);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <primitive object={clonedScene} />
      <InfoPanel data={machineData} isConnected={isConnected} />
    </group>
  );
}