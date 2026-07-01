import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if(token){
          const decoded = jwtDecode(token);
          if (decoded.user_role === "admin") {  
            setToken(token);
          }else{
              navigate('/homepage');
          }
        }else{
          navigate('/login');
        }
    }, []);
  return (
    <div className="w-full flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar/>
        
      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <AdminHeader/>
        {/* Content */}
        <main className="p-8">
          {/* Welcome */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="text-3xl font-bold">
              Welcome Back :wave:
            </h3>
            <p className="text-gray-500 mt-2">
              Manage your books, authors, categories and users from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Books" value="1250" />
            <StatCard title="Authors" value="148" />
            <StatCard title="Categories" value="32" />
            <StatCard title="Orders" value="534" />
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Recent Activity
            </h3>

            <ul className="space-y-4">
              <li className="border-b pb-3">
                :books: New book added - <strong>The Silent Sea</strong>
              </li>

              <li className="border-b pb-3">
                :silhouette: New author registered
              </li>

              <li className="border-b pb-3">
                :shopping_trolley: New order received
              </li>

              <li>
                :star: Review submitted for <strong>Atomic Habits</strong>
              </li>
            </ul>
          </div>
        </main>
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