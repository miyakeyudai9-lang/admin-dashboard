"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StaffTable from "@/components/Staff";
import Breadcrumb from "@/components/Breadcrumb";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
      return;
    }

    if (item === "Clients") {
      router.push("/client");
      return;
    }

    router.push("/staff");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Staff"
        onSelect={handleSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title="Staff" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff", current: true },
            ]}
          />
        </div>

        <StaffTable />
      </main>
    </div>
  );
}
