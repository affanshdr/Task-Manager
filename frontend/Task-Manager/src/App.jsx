import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Private Route
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// User Routes
import DashboardUser from "./pages/User/DashboardUser";
import MyTasks from "./pages/User/MyTasks";

// Admin Routes
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateTasks from "./pages/Admin/CreateTasks";
import Managetasks from "./pages/Admin/ManageTasks";

import PrivateRoute from "./routes/PrivateRoute";


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
            <Route path="/admin/manageusers" element={<ManageUsers />} />
            <Route path="/admin/createtasks" element={<CreateTasks />} />
            <Route path="/admin/managetasks" element={<Managetasks />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<DashboardUser />} />
            <Route path="/user/mytasks" element={<MyTasks />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
