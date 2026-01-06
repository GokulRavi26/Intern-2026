import { Canvas } from "@react-three/fiber";
import Road from "../three/Road";
import Machine from "../three/Machine";
import Man from "../three/Man";
import Ground from "../three/Ground";
import Desk from "../three/Desk";
import JoystickCamera from "../three/JoystickCamera";
import { machinesConfig } from "../config/machineConfig";
import { manConfig } from "../config/manConfig";
import { OrbitControls } from "@react-three/drei";

export default function FactoryPage() {
  return (
    <Canvas camera={{ position: [0, 1.6, 6], fov: 60 }}>
      <ambientLight intensity={3} />
      <directionalLight position={[10, 20, 10]} intensity={1} />

      {/* 🎮 Walkthrough Camera */}
      <JoystickCamera />
      <OrbitControls />
      <Ground />
      <Road />
      <Desk />

      {machinesConfig.map((m) => (
        <Machine key={m.id} {...m} />
      ))}

      {manConfig.map((man) => (
        <Man key={man.id} {...man} />
      ))}
    </Canvas>
  );
}
