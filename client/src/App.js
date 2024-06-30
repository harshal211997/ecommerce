import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignUp from "./Components/LoginSinup/LoginSignUp.js";
import VerifyEmail from "./Components/LoginSinup/VerifyEmail.js";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
