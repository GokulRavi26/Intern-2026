// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import FactoryPage from "./pages/FactoryPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";
import mqttService from "./service/mqttService";

export default function App() {
  useEffect(() => {
    // Initialize MQTT connection when app starts
    // Replace with your actual MQTT broker URL
    const brokerUrl = "ws://localhost:9001"; // WebSocket URL
    // For secure connection use: "wss://your-broker.com:8084"
    
    const options = {
      username: "", // Add if your broker requires authentication
      password: "", // Add if your broker requires authentication
    };

    mqttService.connect(brokerUrl, options);

    // Cleanup on unmount
    return () => {
      mqttService.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <div style={{ width: "100vw", height: "100vh" }}>
        {/* Top Plant Selector (commented out) */}
        {/* <select
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
            padding: "6px"
          }}
        >
          <option>Plant</option>
          <option>EOL MOLDING</option>
          <option>EOL-FINAL_TEST</option>
          <option>AMTDC</option>
        </select> */}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<FactoryPage />} />
          <Route path="/machine/:id" element={<MachineDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}