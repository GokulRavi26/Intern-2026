// src/pages/FactoryPage.jsx
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import Road from "../three/Road";
import Machine from "../three/Machine";
import Man from "../three/Man";
import Ground from "../three/Ground";
import Desk from "../three/Desk";
import JoystickCamera from "../three/JoystickCamera";
import { machinesConfig } from "../config/machineConfig";
import { manConfig } from "../config/manConfig";
import rabbitmqService from "../services/rabbitmqServices";
import "./FactoryPage.css";

export default function FactoryPage({ connectionConfig }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [machineData, setMachineData] = useState({});

  /* ================= CONNECT ON REFRESH ================= */
  useEffect(() => {
    if (!connectionConfig) return;

    rabbitmqService.connect(connectionConfig).catch(console.error);
  }, [connectionConfig]);

  /* ================= SUBSCRIBE TO MACHINES ================= */
  useEffect(() => {
    if (!rabbitmqService.isClientConnected()) return;

    const unsubscribers = machinesConfig.map(machine => {
      return rabbitmqService.subscribe(
        `factory.machine.${machine.id}`,
        data => {
          setMachineData(prev => ({
            ...prev,
            [machine.id]: data,
          }));
        }
      );
    });

    return () => unsubscribers.forEach(u => u && u());
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    rabbitmqService.disconnect();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="factory-root">
      {/* ================= 3D SCENE ================= */}
      <div className="factory-3d-layer">
        <Canvas camera={{ position: [0, 1.6, 6], fov: 60 }}>
          <ambientLight intensity={3} />
          <directionalLight position={[10, 20, 10]} intensity={1} />
          <JoystickCamera />
          <Ground />
          <Road />
          <Desk />

          {machinesConfig.map(machine => (
            <Machine
              key={machine.id}
              {...machine}
              liveData={machineData[machine.id]}
            />
          ))}

          {manConfig.map(man => (
            <Man key={man.id} {...man} />
          ))}
        </Canvas>
      </div>

      {/* ================= UI LAYER ================= */}
      <div className="factory-ui-layer">
        <button
          className="settings-fab"
          onClick={() => setIsSettingsOpen(true)}
          title="Connection Info"
        >
          ⚙️
        </button>
      </div>

      {/* ================= SETTINGS PANEL ================= */}
      {isSettingsOpen && (
        <ConnectionSettings
          currentConfig={connectionConfig}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

/* ================= SETTINGS PANEL ================= */

function ConnectionSettings({ currentConfig, onClose, onLogout }) {
  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Connection Info</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <ReadOnlyField label="Host / IP" value={currentConfig?.host} />
          <ReadOnlyField label="Port" value={currentConfig?.port} />
          <ReadOnlyField label="Username" value={currentConfig?.username} />

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= READ ONLY FIELD ================= */

const ReadOnlyField = ({ label, value }) => (
  <div className="form-field">
    <label>{label}</label>
    <input value={value || ""} readOnly />
  </div>
);
