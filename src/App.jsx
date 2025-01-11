import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/main/Main";
import Gptapi from "./utils/Gptapi";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gptapi" element={<Gptapi />} />
      </Routes>
    </Router>
  );
}

export default App;
