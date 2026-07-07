import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from './pages/dashboard/global/UserContext';
import RegisterForm from './pages/auth/RegisterForm';
import Homepage from './pages/view/Homepage';
import LoginForm from './pages/auth/LoginForm';
import AdminDashboard from "./pages/dashboard/admin_dashboard";
import AdminLogin from "./pages/dashboard/admin_auth/admin_login";
import AdminRegister from "./pages/dashboard/admin_auth/admin_register";
import AdminProfile from "./pages/dashboard/AdminProfile";

import { CSpinner } from '@coreui/react'


function App() {
const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_HOST_URL}/admin-exists`);
        const data = await res.json();
        setAdminExists(data.exists); // assuming API returns { exists: true }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }
if(!adminExists){
  return(
    <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/ds-admin/register" replace/>} />
          <Route path="/ds-admin/register" element={<AdminRegister />} />
        </Routes>
    </BrowserRouter>
  );
}
return (
    <BrowserRouter>
      <UserProvider>
          <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile/:user_id" element={<AdminProfile />} />
            <Route path="/ds-admin/register" element={<Navigate to="/ds-admin/login" />} />
            <Route path="/ds-admin/login" element={<AdminLogin />} />
          </Routes>
        </UserProvider>
    </BrowserRouter>
  );
}

export default App;
