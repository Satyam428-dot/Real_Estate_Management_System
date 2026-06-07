import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from './pages/Register';
import LoginPage from './pages/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
