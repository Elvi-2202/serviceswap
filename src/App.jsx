// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Login from "./pages/LogIn";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/login";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;