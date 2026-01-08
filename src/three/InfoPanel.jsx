//src/three/InfoPanel.jsx
import { Html } from "@react-three/drei";
import { panelConfig } from "../config/panelConfig";
import { panelStyle } from "../styles/panelStyle";

export default function InfoPanel({ data }) {
  return (
    <Html
      position={panelConfig.position}
      rotation={panelConfig.rotation}
      scale={panelConfig.scale}
      distanceFactor={panelConfig.distanceFactor}
      center
    >
      <div style={panelStyle}>
        <div><b>Status:</b> {data.status}</div>
        <div><b>Count:</b> {data.count}</div>
        <div><b>OEE:</b> {data.oee}%</div>
      </div>
    </Html>
  );
}
