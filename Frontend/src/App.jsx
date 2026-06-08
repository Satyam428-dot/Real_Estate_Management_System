import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import Properties from "./pages/Properties";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
