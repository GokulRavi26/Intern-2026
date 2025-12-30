import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Road from "../three/Road";  
import Machine from "../three/Machine";
import Man from "../three/Man";
import Ground from "../three/Ground";
import Desk from "../three/Desk";    
import { machinesConfig } from "../config/machineConfig";
import { manConfig } from "../config/manConfig";

export default function FactoryPage() {
  return (
    <Canvas camera={{ position: [10, 8, 12], fov: 50 }}>
      <ambientLight intensity={3} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
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
