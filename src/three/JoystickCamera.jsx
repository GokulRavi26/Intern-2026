import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function JoystickCamera() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef({ x: 0, y: 0 });

  const moveSpeed = 6;
  const lookSpeed = 2.5;

  useFrame((_, delta) => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // First connected controller

    if (!gp) return;

    // 🎮 LEFT JOYSTICK (Movement)
    const moveX = gp.axes[0]; // left stick horizontal
    const moveZ = gp.axes[1]; // left stick vertical

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    velocity.current.set(0, 0, 0);
    velocity.current
      .add(forward.multiplyScalar(-moveZ * moveSpeed * delta))
      .add(right.multiplyScalar(moveX * moveSpeed * delta));

    camera.position.add(velocity.current);

    // 🎮 RIGHT JOYSTICK (Look)
    const lookX = gp.axes[2]; // right stick horizontal
    const lookY = gp.axes[3]; // right stick vertical

    rotation.current.y -= lookX * lookSpeed * delta;
    rotation.current.x -= lookY * lookSpeed * delta;

    rotation.current.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, rotation.current.x)
    );

    camera.rotation.set(
      rotation.current.x,
      rotation.current.y,
      0
    );
  });

  return null;
}


// import { useFrame, useThree } from "@react-three/fiber";
// import { useRef } from "react";
// import * as THREE from "three";

// export default function JoystickCamera() {
//   const { camera } = useThree();
//   const velocity = useRef(new THREE.Vector3());

//   const moveSpeed = 5;
//   const deadZone = 0.4; // prevents drift

//   useFrame((_, delta) => {
//     const gamepads = navigator.getGamepads();
//     const gp = gamepads[0];

//     if (!gp) return;

//     let x = gp.axes[0]; // left stick horizontal
//     let z = gp.axes[1]; // left stick vertical

//     // 🛑 Deadzone
//     if (Math.abs(x) < deadZone) x = 0;
//     if (Math.abs(z) < deadZone) z = 0;

//     // 🚫 No diagonal movement
//     if (Math.abs(x) > Math.abs(z)) {
//       z = 0;
//     } else {
//       x = 0;
//     }

//     const forward = new THREE.Vector3();
//     camera.getWorldDirection(forward);
//     forward.y = 0;
//     forward.normalize();

//     const right = new THREE.Vector3();
//     right.crossVectors(forward, camera.up).normalize();

//     velocity.current.set(0, 0, 0);

//     // ⬆⬇ Forward / Backward
//     if (z !== 0) {
//       velocity.current.add(
//         forward.multiplyScalar(-Math.sign(z) * moveSpeed * delta)
//       );
//     }

//     // ⬅➡ Left / Right
//     if (x !== 0) {
//       velocity.current.add(
//         right.multiplyScalar(Math.sign(x) * moveSpeed * delta)
//       );
//     }

//     camera.position.add(velocity.current);
//   });

//   return null;
// }
