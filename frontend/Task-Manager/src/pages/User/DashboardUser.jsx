import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';

const DashboardUser =() => {
  useUserAuth();
  return (
    <div className='text-6xl font-bold'>DashboardUser</div>
  )
}

export default DashboardUser;