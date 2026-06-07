
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "../../../bootstrap-5.3.8-dist/bootstrap-5.3.8-dist/css/bootstrap.min.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
);

