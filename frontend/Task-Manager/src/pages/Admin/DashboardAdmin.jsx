import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from '../../components/layouts/DashboardLayout';

const DashboardAdmin =() => {
  useUserAuth();

  const {user} = useContext(UserContext);

  return (
    <DashboardLayout>DashboardAdmin

      {JSON.stringify(user)}
    </DashboardLayout>
  )
}

export default DashboardAdmin;