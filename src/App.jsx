// // src/App.jsx
// import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";
// import { useEffect } from "react";
// import FactoryPage from "./pages/FactoryPage";
// import MachineDetailsPage from "./pages/MachineDetailsPage";
// import rabbitmqService from "./services/rabbitmqServices";

// export default function App() {
//   useEffect(() => {
//     const brokerUrl = "http://192.168.150.139:15674/stomp";

//     const options = {
//       username: "factory",
//       password: "factory",
//     };

//     rabbitmqService.connect(brokerUrl, options);

//     return () => {
//       rabbitmqService.disconnect();
//     };
//   }, []);

//   return (
//     <BrowserRouter>
//       <div style={{ width: "100vw", height: "100vh" }}>
//         <Routes>
//           <Route path="/" element={<FactoryPage />} />
//           <Route path="/machine/:id" element={<MachineDetailsPage />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// src/App.jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import FactoryPage from "./pages/FactoryPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";
import ConnectionLogin from "./components/ConnectionLogin";
import rabbitmqService from "./services/rabbitmqServices";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= RESTORE SESSION ON REFRESH ================= */
  useEffect(() => {
    const host = localStorage.getItem("rabbitmq_host");
    const port = localStorage.getItem("rabbitmq_port");
    const username = localStorage.getItem("rabbitmq_username");

    if (host && port && username) {
      setConnectionConfig({ host, port, username });
      setIsConnected(true); // ✅ KEY LINE
    }

    setIsLoading(false);
  }, []);

  /* ================= CONNECT HANDLER ================= */
  const handleConnect = async (credentials) => {
    try {
      await rabbitmqService.connect({
        host: credentials.host,
        port: Number(credentials.port),
        username: credentials.username,
        password: credentials.password,
      });

      // Save session (NO PASSWORD)
      localStorage.setItem("rabbitmq_host", credentials.host);
      localStorage.setItem("rabbitmq_port", credentials.port);
      localStorage.setItem("rabbitmq_username", credentials.username);

      setConnectionConfig({
        host: credentials.host,
        port: credentials.port,
        username: credentials.username,
      });

      setIsConnected(true);
    } catch (err) {
      console.error("Connection failed:", err);
      throw new Error(
        "Failed to connect to RabbitMQ. Please check your credentials."
      );
    }
  };

  /* ================= LOADING SCREEN ================= */
  if (isLoading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        fontSize: "1.5em"
      }}>
        Loading...
      </div>
    );
  }

  /* ================= LOGIN ONLY WHEN STORAGE EMPTY ================= */
  if (!isConnected) {
    return <ConnectionLogin onConnect={handleConnect} />;
  }

  /* ================= MAIN APP ================= */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<FactoryPage connectionConfig={connectionConfig} />}
        />
        <Route
          path="/machine/:id"
          element={<MachineDetailsPage connectionConfig={connectionConfig} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
