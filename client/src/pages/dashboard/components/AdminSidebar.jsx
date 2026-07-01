import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Tags,
  ShoppingCart,
  Star,
  Settings,
  LogOut,
} from "lucide-react";


export default function AdminSidebar() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Books", icon: <BookOpen size={20} /> },
    { name: "Authors", icon: <Users size={20} /> },
    { name: "Categories", icon: <Tags size={20} /> },
    { name: "Orders", icon: <ShoppingCart size={20} /> },
    { name: "Reviews", icon: <Star size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  // logout function
  const logoutUser = () => {
    removeCookie('token', {path: '/' });
    navigate('/ds-admin/login');
  };
  return(
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">Book Admin</h1>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition
                ${
                  item.name === "Dashboard"
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={logoutUser} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
  )
}