import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const DashboardAdmin = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      alert("Token yang digunakan:", token);
  
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      alert("Dashboard Data:", response.data);
  
      setDashboardData(response.data);
    } catch (error) {
      alert("Error Fetching Users:", error.response?.status, error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    if (user && user.role === 'admin') {
      console.log("Admin")
      getDashboardData();
    } else {
      // Kalau bukan admin, bisa pakai GET_USER_DASHBOARD_DATA
      // atau abaikan, tergantung kebutuhan
      console.log("Bukan admin, tidak fetch dashboard");
    }
  }, [user]);
  

  return <DashboardLayout activeMenu="Dashboard">Dashboard
  </DashboardLayout>;
};

export default DashboardAdmin;
