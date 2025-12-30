import { BrowserRouter, Routes, Route } from "react-router-dom";
import FactoryPage from "./pages/FactoryPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ width: "100vw", height: "100vh" }}>
        {/* Top Plant Selector */}
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
