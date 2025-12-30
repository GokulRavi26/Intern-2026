// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import FactoryPage from "./pages/FactoryPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";
import rabbitmqService from "./services/rabbitmqServices";

export default function App() {
  useEffect(() => {
    // Initialize RabbitMQ connection when app starts
    // RabbitMQ Web STOMP plugin URL (default port 15674)
    const brokerUrl = "http://localhost:15674/stomp";
    // For secure connection use: "https://your-broker.com:15674/stomp"
    
    const options = {
      username: "guest", // RabbitMQ username
      password: "guest", // RabbitMQ password
    };

    rabbitmqService.connect(brokerUrl, options);

    // Cleanup on unmount
    return () => {
      rabbitmqService.disconnect();
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