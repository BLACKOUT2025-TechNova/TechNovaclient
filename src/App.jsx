import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/main/Main";
import Mapview from "./pages/mapview/Mapview";
import Authhunter from "./pages/authhunter/Authhunter";
import QRScanner from "./pages/qrscanner/QRScanner";
import Imgupload from "./pages/imgupload/Imgupload";
import Resultpage from "./pages/result/Resultpage";
import Signup from "./pages/signup/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/mapview" element={<Mapview />} />
        <Route path="/authhunter" element={<Authhunter />} />
        <Route path="/qrscanner" element={<QRScanner />} />
        <Route path="/imgupload" element={<Imgupload />} />
        <Route path="/resultpage" element={<Resultpage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
