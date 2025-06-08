// src/App.tsx
import React, { Suspense } from "react";
import AppRouter from "./Pages/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Pages/css/login.css";
import "./components/sideBarMenu.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

//import AppProviders from "../context/AppProvider"; // AppProviders bileşenini import ettik

const App: React.FC = () => {
  return (
    <BrowserRouter>
     <AppRouter />
     </BrowserRouter>

  );
};

export default App;
