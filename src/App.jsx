import BuilderPage from "./pages/BuilderPage/BuilderPage";
import RendererPage from "./pages/RendererPage/RendererPage";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route, BrowserRouter, Link, Navigate } from "react-router-dom";
import "@coreui/coreui/dist/css/coreui.min.css";
export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/builder" replace />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/renderer" element={<RendererPage />} />
        </Routes>
      </div>
    </>
  );
}
