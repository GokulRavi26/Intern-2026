// src/three/JoystickCamera.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function JoystickCamera() {
  const { camera, scene } = useThree();

  /* ================= SETTINGS ================= */
  const MOVE_SPEED = 4.5;
  const LOOK_SPEED = 2.2;
  const SMOOTH_MOVE = 8;
  const SMOOTH_LOOK = 10;
  const DEAD_ZONE = 0.15;

  const CAMERA_RADIUS = 0.35; // body width
  const CAMERA_HEIGHT = 1.6; // eye height
  const MAX_PITCH = THREE.MathUtils.degToRad(5);

  /* ================= STATE ================= */
  const velocity = useRef(new THREE.Vector3());
  const targetVelocity = useRef(new THREE.Vector3());

  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  const colliders = useRef([]);

  /* ================= COLLECT COLLIDERS ================= */
  useEffect(() => {
    colliders.current = [];

    scene.traverse((obj) => {
      if (obj.userData?.collider) {
        const box = new THREE.Box3().setFromObject(obj);
        colliders.current.push({ object: obj, box });
      }
    });
  }, [scene]);

  /* ================= COLLISION CHECK ================= */
  const canMoveTo = (pos) => {
    const camBox = new THREE.Box3(
      new THREE.Vector3(
        pos.x - CAMERA_RADIUS,
        pos.y - CAMERA_HEIGHT,
        pos.z - CAMERA_RADIUS
      ),
      new THREE.Vector3(
        pos.x + CAMERA_RADIUS,
        pos.y + 0.2,
        pos.z + CAMERA_RADIUS
      )
    );

    for (const col of colliders.current) {
      col.box.setFromObject(col.object);
      if (camBox.intersectsBox(col.box)) return false;
    }
    return true;
  };

  /* ================= FRAME LOOP ================= */
  useFrame((_, delta) => {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    /* ---------- MOVEMENT INPUT ---------- */
    const moveX = Math.abs(gp.axes[0]) > DEAD_ZONE ? gp.axes[0] : 0;
    const moveZ = Math.abs(gp.axes[1]) > DEAD_ZONE ? gp.axes[1] : 0;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    targetVelocity.current
      .set(0, 0, 0)
      .add(forward.multiplyScalar(-moveZ * MOVE_SPEED))
      .add(right.multiplyScalar(moveX * MOVE_SPEED));

    velocity.current.lerp(targetVelocity.current, SMOOTH_MOVE * delta);

    const deltaMove = velocity.current.clone().multiplyScalar(delta);

    /* ---------- SLIDING COLLISION ---------- */
    const nextX = camera.position.clone();
    nextX.x += deltaMove.x;
    if (canMoveTo(nextX)) {
      camera.position.x = nextX.x;
    }

    const nextZ = camera.position.clone();
    nextZ.z += deltaMove.z;
    if (canMoveTo(nextZ)) {
      camera.position.z = nextZ.z;
    }

    /* ---------- LOOK INPUT ---------- */
    const lookX = Math.abs(gp.axes[2]) > DEAD_ZONE ? gp.axes[2] : 0;
    const lookY = Math.abs(gp.axes[3]) > DEAD_ZONE ? gp.axes[3] : 0;

    targetRotation.current.y -= lookX * LOOK_SPEED * delta;
    targetRotation.current.x -= lookY * LOOK_SPEED * delta;

    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x,
      -MAX_PITCH,
      MAX_PITCH
    );

    rotation.current.x = THREE.MathUtils.lerp(
      rotation.current.x,
      targetRotation.current.x,
      SMOOTH_LOOK * delta
    );
    rotation.current.y = THREE.MathUtils.lerp(
      rotation.current.y,
      targetRotation.current.y,
      SMOOTH_LOOK * delta
    );

    camera.rotation.set(rotation.current.x, rotation.current.y, 0);
  });

  return null;
}