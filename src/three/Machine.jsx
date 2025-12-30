// import { useGLTF } from "@react-three/drei";
// import { useEffect } from "react";
// import * as THREE from "three";
// import InfoPanel from "./InfoPanel";
// import { useRandomMachineData } from "../data/useRandomMachineData";


// export default function Machine({ id, model, position, rotation, scale, status }) {
//   const { scene } = useGLTF(model);
//   const clonedScene = scene.clone(true);

//   const machineData = useRandomMachineData(id); // 🔥 RANDOM LIVE DATA

//   useEffect(() => {
//     const box = new THREE.Box3().setFromObject(clonedScene);
//     const center = box.getCenter(new THREE.Vector3());
//     clonedScene.position.sub(center);
//   }, [clonedScene]);

//   return (
//     <group position={position} rotation={rotation} scale={scale}>
//       <primitive object={clonedScene} />
//       <InfoPanel data={machineData} />
//     </group>
//   );
// }


import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import InfoPanel from "./InfoPanel";
import { useRandomMachineData } from "../data/useRandomMachineData";

export default function Machine({ id, model, position, rotation, scale }) {
  const { scene } = useGLTF(model);
  const clonedScene = scene.clone(true);
  const navigate = useNavigate();

  const machineData = useRandomMachineData(id);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);
  }, [clonedScene]);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation(); // prevent scene click
        navigate(`/machine/${id}`);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <primitive object={clonedScene} />
      <InfoPanel data={machineData} />
    </group>
  );
}
