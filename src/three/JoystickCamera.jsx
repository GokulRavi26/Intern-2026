import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function JoystickCamera() {
  const { camera } = useThree();

  const velocity = useRef(new THREE.Vector3());
  const targetVelocity = useRef(new THREE.Vector3());

  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  const moveSpeed = 4.5;     // Unity walk speed
  const lookSpeed = 2.2;     // Unity mouse sensitivity
  const smoothMove = 8;      // Movement smoothing
  const smoothLook = 10;     // Rotation smoothing
  const deadZone = 0.15;

  useFrame((_, delta) => {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    // -------------------------
    // 🎮 LEFT JOYSTICK (MOVE)
    // -------------------------
    let moveX = Math.abs(gp.axes[0]) > deadZone ? gp.axes[0] : 0;
    let moveZ = Math.abs(gp.axes[1]) > deadZone ? gp.axes[1] : 0;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    targetVelocity.current
      .set(0, 0, 0)
      .add(forward.multiplyScalar(-moveZ * moveSpeed))
      .add(right.multiplyScalar(moveX * moveSpeed));

    // Smooth movement (Unity-style)
    velocity.current.lerp(targetVelocity.current, smoothMove * delta);
    camera.position.addScaledVector(velocity.current, delta);

    // -------------------------
    // 🎮 RIGHT JOYSTICK (LOOK)
    // -------------------------
    let lookX = Math.abs(gp.axes[2]) > deadZone ? gp.axes[2] : 0;
    let lookY = Math.abs(gp.axes[3]) > deadZone ? gp.axes[3] : 0;

    targetRotation.current.y -= lookX * lookSpeed * delta;
    targetRotation.current.x -= lookY * lookSpeed * delta;

    // Clamp vertical look (Unity FPS)
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x,
      -Math.PI / 2,
      Math.PI / 2
    );

    // Smooth rotation
    rotation.current.x = THREE.MathUtils.lerp(
      rotation.current.x,
      targetRotation.current.x,
      smoothLook * delta
    );

    rotation.current.y = THREE.MathUtils.lerp(
      rotation.current.y,
      targetRotation.current.y,
      smoothLook * delta
    );

    camera.rotation.set(rotation.current.x, rotation.current.y, 0);
  });

  return null;
}
