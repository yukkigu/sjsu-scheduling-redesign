import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import ClassSearchPage from "./ClassSearchPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/class-search" element={<ClassSearchPage />} />
    </Routes>
  );
}
