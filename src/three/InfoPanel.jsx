// src/three/InfoPanel.jsx
import { Html } from "@react-three/drei";
import { panelConfig } from "../config/panelConfig";
import { panelStyle } from "../styles/panelStyle";

export default function InfoPanel({ data, isConnected = false }) {
  // Determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "#10b981"; // green
      case "idle":
        return "#f59e0b"; // orange
      case "stopped":
        return "#ef4444"; // red
      case "offline":
      case "connecting...":
        return "#6b7280"; // gray
      default:
        return "#6b7280";
    }
  };

  // Determine OEE color
  const getOEEColor = (oee) => {
    if (oee >= 85) return "#10b981"; // green
    if (oee >= 70) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const statusColor = getStatusColor(data.status);
  const oeeColor = getOEEColor(data.oee);

  return (
    <Html
      position={panelConfig.position}
      rotation={panelConfig.rotation}
      scale={panelConfig.scale}
      distanceFactor={panelConfig.distanceFactor}
      center
    >
      <div style={{
        ...panelStyle,
        borderLeft: `4px solid ${statusColor}`,
        position: "relative"
      }}>
        {/* Connection indicator */}
        <div style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isConnected ? "#10b981" : "#ef4444",
          boxShadow: isConnected 
            ? "0 0 8px rgba(16, 185, 129, 0.8)" 
            : "0 0 8px rgba(239, 68, 68, 0.8)"
        }} />

        <div style={{ marginBottom: "4px" }}>
          <b>Status:</b>{" "}
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {data.status}
          </span>
        </div>
        
        <div style={{ marginBottom: "4px" }}>
          <b>Count:</b> {data.count}
        </div>
        
        <div>
          <b>OEE:</b>{" "}
          <span style={{ color: oeeColor, fontWeight: "bold" }}>
            {data.oee}%
          </span>
        </div>

        {/* Additional info if available */}
        {data.speed > 0 && (
          <div style={{ marginTop: "4px", fontSize: "22px", opacity: 0.8 }}>
            <b>Speed:</b> {data.speed} rpm
          </div>
        )}

        {/* Timestamp */}
        {data.timestamp && (
          <div style={{ 
            marginTop: "8px", 
            fontSize: "18px", 
            opacity: 0.6,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "4px"
          }}>
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </Html>
  );
}