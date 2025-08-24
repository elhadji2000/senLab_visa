import React  from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import TrigoCirclePage from "./components/TrigoCirclePage";
import Navbar from "./components/Navbar";

// ===== App & Mount
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trigo" element={<TrigoCirclePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
