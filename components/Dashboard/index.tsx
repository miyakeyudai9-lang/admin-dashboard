"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import StaffTable from "../Staff";
import { dashboardStats, recentActivities } from "./dashboard.type";
import type { SidebarItem } from "../Sidebar/sidebar.type";

export default function DashboardComponentnent() {
  const [selectedView, setSelectedView] = useState<SidebarItem>("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected={selectedView}
        onSelect={setSelectedView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title={selectedView} />

        {selectedView === "Dashboard" ? (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {dashboardStats.map((stat) => (
                <div key={stat.title} className="bg-white p-6 rounded shadow">
                  <h3 className="text-gray-500">{stat.title}</h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded shadow p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Recent Activities</h3>

              <ul className="space-y-3">
                {recentActivities.map((activity) => (
                  <li key={activity.id}>{activity.text}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <StaffTable />
        )}
      </main>
    </div>
  );
}
