// import { useGLTF } from "@react-three/drei";
// import { useEffect, useMemo } from "react";
// import * as THREE from "three";
// import { deskConfig } from "../config/deskConfig";

// export default function Desk() {
//   return (
//     <>
//       {deskConfig.map((d) => {
//         const { scene } = useGLTF(d.model);
//         const clonedScene = useMemo(() => scene.clone(true), [scene]);

//         useEffect(() => {
//           let mesh = null;
//           clonedScene.traverse((child) => {
//             if (child.isMesh && !mesh) mesh = child;
//           });
//           if (!mesh) return;

//           const box = new THREE.Box3().setFromObject(mesh);
//           const center = box.getCenter(new THREE.Vector3());

//           mesh.position.sub(center);
//           mesh.position.y -= box.min.y;
//         }, [clonedScene]);

//         return (
//           <group
//             key={d.id}
//             position={d.position}
//             rotation={d.rotation}
//             scale={d.scale}
//           >
//             <primitive object={clonedScene} />
//           </group>
//         );
//       })}
//     </>
//   );
// }


import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { deskConfig } from "../config/deskConfig";

function DeskItem({ model, position, rotation, scale }) {
  const { scene } = useGLTF(model);

  const clonedScene = useMemo(
    () => scene.clone(true),
    [scene]
  );

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
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function Desk() {
  return (
    <>
      {deskConfig.map((d) => (
        <DeskItem
          key={`desk-${d.id}`}   // ✅ guaranteed unique
          {...d}
        />
      ))}
    </>
  );
}