import React from "react";
import ReactDOM from "react-dom/client"; // <-- Utiliser "react-dom/client"

import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // <-- Créer un root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
