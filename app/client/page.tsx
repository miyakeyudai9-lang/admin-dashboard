"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ClientTable from "@/components/Client";
import { staffData } from "@/components/Staff/staff.type";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";

export default function ClientPage() {
  return (
    <Suspense fallback={<ClientPageFallback />}>
      <ClientPageContent />
    </Suspense>
  );
}

function ClientPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = Number(searchParams.get("staffId") ?? 0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectedStaff = staffData.find((staff) => staff.id === staffId) ?? null;

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
      return;
    }

    router.push(`/client?staffId=${staffId || 1}`);
  };

  if (!selectedStaff) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          selected="Staff"
          onSelect={handleSidebarSelect}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-8">
          <Navbar />
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold">Client Details</h2>
            <p className="mt-4 text-gray-600">No staff selected.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Staff"
        onSelect={handleSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar />
        <ClientTable staffName={selectedStaff.name} clients={selectedStaff.clients} />
      </main>
    </div>
  );
}

function ClientPageFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-5">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}
