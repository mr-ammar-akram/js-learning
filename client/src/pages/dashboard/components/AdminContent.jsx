import React from "react";



export default function AdminContent() { 
            <main className="flex-1 p-8">
              {/* Welcome */}
              <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h3 className="text-xl font-bold">
                  Welcome Back :wave:
                </h3>
                <p className="text-gray-500 mt-2">
                  Manage your books, authors, categories and users from one place.
                </p>
              </div>
    
              {/* Stats */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Books" value="1250" />
                <StatCard title="Authors" value="148" />
                <StatCard title="Categories" value="32" />
                <StatCard title="Orders" value="534" />
              </div> */}
    
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
}