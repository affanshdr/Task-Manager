import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';

const DashboardAdmin =() => {
  useUserAuth();

  

  return (
    <div className='text-6xl font-bold'>DashboardAdmin</div>
  )
}

export default DashboardAdmin;