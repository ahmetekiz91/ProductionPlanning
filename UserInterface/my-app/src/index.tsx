
import React,{ StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
 <React.StrictMode>
  <App />
   {/* <Router>

    <App />
    </Router> */}
    ,
  </React.StrictMode>

);

reportWebVitals();




