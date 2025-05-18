import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";

const DashboardAdmin = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      console.log("Dashboard data:", response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
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
  

  return <DashboardLayout activeMenu="Dashboard">
    <div className="card my-5">
      <div>
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good morning! {user?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd, MMMM D, YYYY")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
        <InfoCard
          label= "Total Tasks"
          value = {addThousandsSeparator(dashboardData?.charts?.taskDistrinution?.All || 0)}
          color= "bg-primary"        
        />
      </div>
    </div>
  </DashboardLayout>;
};

export default DashboardAdmin;
