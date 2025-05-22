import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

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
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
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
              <Route path="/admin/create-task" element={<CreateTasks />} />
              <Route path="/admin/tasks" element={<Managetasks />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<DashboardUser />} />
              <Route path="/user/mytasks" element={<MyTasks />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="user/dashboard" />;
};
