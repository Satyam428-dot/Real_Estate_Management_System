import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/Student" element={<Student />} /> */}
        {/* <Route path="/Course" element={<Course />} /> */}
      </Routes>
    </>
  );
}

export default App;
