

//src/three/Desk.jsx
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
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      userData={{ collider: true }}   // ✅ COLLIDER FLAG
    >
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


// // src/three/Desk.jsx
// import { useGLTF, useAnimations } from "@react-three/drei";
// import { useEffect, useMemo, useRef } from "react";
// import * as THREE from "three";
// import { deskConfig } from "../config/deskConfig";

// function DeskItem({ model, position, rotation, scale }) {
//   const groupRef = useRef();

//   // Load the GLTF with animations
//   const { scene, animations } = useGLTF(model);
//   const clonedScene = useMemo(() => scene.clone(true), [scene]);

//   // Hook to control animations
//   const { actions, mixer } = useAnimations(animations, groupRef);

//   useEffect(() => {
//     // Play all available animations by default
//     if (animations && animations.length) {
//       Object.values(actions).forEach((action) => {
//         action.reset().play();
//       });
//     }
//   }, [actions, animations]);

//   useEffect(() => {
//     // Center the model and align to ground
//     let mesh = null;
//     clonedScene.traverse((child) => {
//       if (child.isMesh && !mesh) mesh = child;
//     });
//     if (!mesh) return;

//     const box = new THREE.Box3().setFromObject(mesh);
//     const center = box.getCenter(new THREE.Vector3());
//     mesh.position.sub(center);
//     mesh.position.y -= box.min.y;
//   }, [clonedScene]);

//   return (
//     <group
//       ref={groupRef}
//       position={position}
//       rotation={rotation}
//       scale={scale}
//       userData={{ collider: true }} // ✅ Collider flag
//     >
//       <primitive object={clonedScene} />
//     </group>
//   );
// }

// export default function Desk() {
//   return (
//     <>
//       {deskConfig.map((d) => (
//         <DeskItem
//           key={`desk-${d.id}`} // ✅ unique
//           {...d}
//         />
//       ))}
//     </>
//   );
// }
