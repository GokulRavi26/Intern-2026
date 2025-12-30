import React from "react";
import { useParams } from "react-router-dom";
import MachinePreview3D from "../three/MachinePreview3D";


export default function MachineDetailsPage() {
  const { id } = useParams(); // 🔥 Dynamic machine id from URL

  const machineData = {
    id: id, // ✅ dynamic
    area: 2,
    operatorId: "PMC2001",
    status: "Running",
    speed: 900,
    productCount: 154,
    productInQueue: 45,
    oeeForecasted: 0,
    oeeActual: 0,
    trendOee: 0,
  };

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
          <h2 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "600" }}>
            {machineData.id}
          </h2>
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
            <div><strong>Machine ID:</strong> {machineData.id}</div>
            <div><strong>Area:</strong> {machineData.area}</div>
            <div><strong>Operator ID:</strong> {machineData.operatorId}</div>
            <div><strong>Status:</strong> {machineData.status}</div>
            <div><strong>Speed:</strong> {machineData.speed}</div>
            <div><strong>Product Count:</strong> {machineData.productCount}</div>
            <div><strong>Product in Queue:</strong> {machineData.productInQueue}</div>
          </div>
        </div>

        {/* Forecasting Card */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Forecasting and predictive analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "250px" }}>
            Chart Area
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Anomalies & Alerts</h3>
          <div style={{ border: "2px dashed #fca5a5", padding: "15px" }}>
            The OEE is expected to drop upto <strong>{machineData.oeeActual}%</strong>
          </div>
        </div>

        {/* Downtime */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Downtime Forecast Chart</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "350px" }}>
            Chart Area
          </div>
        </div>

        {/* Root Cause */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Root Cause Analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "390px" }}>
            Chart Area
          </div>
        </div>

        {/* Trend */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
          <h3>Trend Analysis</h3>
          <div style={{ border: "2px dashed #e5e5e5", height: "300px" }}>
            Chart Area
          </div>
        </div>
      </div>
    </div>
  );
}
