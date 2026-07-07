import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminContent from "./components/AdminContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if(token){
          const decoded = jwtDecode(token);
          if (decoded.user_role === "admin") { 
            setUserData(decoded);
            setToken(token);
          }else{
              navigate('/homepage');
          }
        }else{
          navigate('/login');
        }
    }, [navigate]);
  return (
    <div className="w-full flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar/>
      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <AdminHeader userD={userData ? userData : {}}/>
        <AdminContent />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}