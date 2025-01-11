import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/main/Main";
import Gptapi from "./utils/Gptapi";
import Mapview from "./pages/mapview/Mapview";
import Authhunter from "./pages/authhunter/Authhunter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gptapi" element={<Gptapi />} />
        <Route path="/mapview" element={<Mapview />} />
        <Route path="/authhunter" element={<Authhunter />} />
      </Routes>
    </Router>
  );
}

export default App;
