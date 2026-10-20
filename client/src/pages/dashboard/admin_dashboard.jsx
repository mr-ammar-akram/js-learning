import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminContent from "./components/AdminContent";
import { useProfile } from "./global/UserContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [ setToken] = useState(null);
    const [ userData, setUserData] = useState({});
    const { getProfileImage } = useProfile(); 
    

    useEffect(() => {

    const checkToken = async () => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if(token){
          const decoded = jwtDecode(token);
          if (decoded.user_role === "admin") { 
            // user detail 
            const user_id = decoded.id;
            const profileImage = await getProfileImage(user_id);
            if(profileImage){
              setUserData(profileImage.data);
            }else{
              setUserData(decoded);
            }
            setToken(token);
          }else{
              navigate('/homepage');
          }
        }else{
          navigate('/login');
        }
    }
    checkToken();
    }, [navigate, getProfileImage, setToken]);
  return (
    <div className="w-full flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar/>
      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <AdminHeader pageName="Dashboard" userD={userData ? userData : {}}/>
        <AdminContent />
      </div>
    </div>
  );
}

// function StatCard({ title, value }) {
//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <p className="text-gray-500">{title}</p>
//       <h2 className="text-3xl font-bold mt-2">{value}</h2>
//     </div>
//   );
// }