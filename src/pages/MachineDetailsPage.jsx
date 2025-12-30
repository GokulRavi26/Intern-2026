// src/pages/MachineDetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import MachinePreview3D from "../three/MachinePreview3D";
import { useRabbitMQMachineData } from "../data/useRabbitMQMachineData";

export default function MachineDetailsPage() {
  const { id } = useParams();
  
  // Get real-time RabbitMQ data for this machine
  const { data: machineData, isConnected } = useRabbitMQMachineData(id);

  return (
    <div
      style={{
        width: "95%",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "20px",
        }}
      >
        ← Back
      </button>

      {/* Connection Status Banner */}
      {!isConnected && (
        <div style={{
          background: "#fef3c7",
          border: "1px solid #f59e0b",
          color: "#92400e",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          ⚠️ Waiting for real-time data connection...
        </div>
      )}

      {/* Grid Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "1600px",
        }}
      >
        {/* Machine Details Card */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
              {id}
            </h2>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isConnected ? "#10b981" : "#ef4444",
                animation: isConnected ? "pulse 2s infinite" : "none"
              }} />
              <span style={{ fontSize: "12px", color: "#666" }}>
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
          </div>
          
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#666" }}>
            Machine Details
          </p>

          {/* 3D Preview Section */}
          <div
            style={{
              width: "100%",
              height: "200px",
              background: "#f9f9f9",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            <MachinePreview3D
              modelUrl="/models/machines/machine1.glb"
              scale={0.004}
            />
          </div>

          {/* Info */}
          <div style={{ fontSize: "14px", lineHeight: "2" }}>
            <div><strong>Machine ID:</strong> {id}</div>
            <div>
              <strong>Status:</strong>{" "}
              <span style={{ 
                color: machineData.status === "Running" ? "#10b981" : 
                       machineData.status === "Idle" ? "#f59e0b" : "#ef4444",
                fontWeight: "600"
              }}>
                {machineData.status}
              </span>
            </div>
            <div><strong>Speed:</strong> {machineData.speed} rpm</div>
            <div><strong>Product Count:</strong> {machineData.count}</div>
            <div><strong>Temperature:</strong> {machineData.temperature}°C</div>
            <div><strong>Vibration:</strong> {machineData.vibration} Hz</div>
            <div>
              <strong>OEE:</strong>{" "}
              <span style={{ 
                color: machineData.oee >= 85 ? "#10b981" : 
                       machineData.oee >= 70 ? "#f59e0b" : "#ef4444",
                fontWeight: "600"
              }}>
                {machineData.oee}%
              </span>
            </div>
            {machineData.timestamp && (
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                <strong>Last Update:</strong> {new Date(machineData.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Forecasting Card */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Forecasting and predictive analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Chart Area - OEE: {machineData.oee}%
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Anomalies & Alerts</h3>
          <div style={{ 
            border: machineData.oee < 70 ? "2px solid #fca5a5" : "2px dashed #d1fae5", 
            padding: "15px",
            background: machineData.oee < 70 ? "#fef2f2" : "#f0fdf4"
          }}>
            {machineData.oee < 70 ? (
              <>⚠️ The OEE is expected to drop to <strong>{machineData.oee}%</strong></>
            ) : (
              <>✓ Machine operating within normal parameters</>
            )}
          </div>
        </div>

        {/* Downtime */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Downtime Forecast Chart</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "350px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Chart Area
          </div>
        </div>

        {/* Root Cause */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Root Cause Analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "390px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Chart Area
          </div>
        </div>

        {/* Trend */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Trend Analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Chart Area
          </div>
        </div>
      </div>

      {/* Add CSS animation for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}