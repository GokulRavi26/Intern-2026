import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

function Model({ url, scale }) {
  const { scene } = useGLTF(url);

  // ✅ Center the model so it rotates in place
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  return <primitive object={scene} scale={scale} />;
}

export default function MachinePreview3D({
  modelUrl,
  scale = 0.004,
}) {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* 3D Model */}
      <Model url={modelUrl} scale={scale} />

      {/* ✅ Auto-rotate + Mouse drag */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
