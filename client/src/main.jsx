import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import SellerDashboard from "./components/SellerDashboard.jsx";
import BuyerDashboard from "./components/BuyerDashboard.jsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Signup />} /> {/* Fix: provide home route */}
      <Route path="/login" element={<Login />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
