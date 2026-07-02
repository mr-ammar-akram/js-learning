import React from "react";


export default function AdminHeader() {
        return(

        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          <div className="flex items-center gap-3">
            <img
              src="i.pravatar.cc/100"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </header>
        )
    }