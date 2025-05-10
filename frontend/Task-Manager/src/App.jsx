import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Private Route
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// Admin Routes
import DashboardAdmin from "./pages/Admin/DashboardAdmin";

const App = () => {
  return (
    <div className="text-6xl font-bold">
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
