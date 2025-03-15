import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./i18n/i18n";

// TODO: Update react render syntax
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// const container = document.getElementById('root');
// const root = ReactDOM.createRoot(container!);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );