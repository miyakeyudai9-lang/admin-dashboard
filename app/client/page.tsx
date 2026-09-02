"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ClientTable from "@/components/Client";
import Breadcrumb from "@/components/Breadcrumb";
import { allClients, staffData, type Client } from "@/components/Staff/staff.type";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import { useAuthStore } from "@/store/auth-store";

export default function ClientPage() {
  return (
    <Suspense fallback={<ClientPageFallback />}>
      <ClientPageContent />
    </Suspense>
  );
}

function ClientPageContent() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const currentStaff = useMemo(
    () =>
      staffData.find(
        (staff) =>
          staff.id === user?.id ||
          staff.email === user?.email ||
          staff.name === user?.name,
      ) ?? null,
    [user],
  );

  const [clients, setClients] = useState<Client[]>(() =>
    allClients.map((client) => ({
      ...client,
      assignedStaffId: client.assignedStaffId ?? 1,
    })),
  );

  const visibleClients = isAdmin
    ? clients
    : currentStaff
      ? clients.filter((client) => client.assignedStaffId === currentStaff.id)
      : [];

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
      return;
    }

    if (item === "Staff") {
      router.push("/staff");
      return;
    }

    router.push("/client");
  };

  const handleAssignClient = (clientId: number, staffId: number) => {
    setClients((previous) =>
      previous.map((client) =>
        client.clientId === clientId
          ? { ...client, assignedStaffId: staffId }
          : client,
      ),
    );
  };

  const handleAddClient = () => {
    router.push("/client/clientDetailPage?mode=create");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Clients"
        onSelect={handleSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title={isAdmin ? "Clients" : `${currentStaff?.name ?? "My"} Clients`} />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client", current: true },
            ]}
          />
        </div>

        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleAddClient}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
              Add Client
            </button>
          </div>
        )}

        <ClientTable
          title={isAdmin ? "All Clients" : `${currentStaff?.name ?? "My"} Clients`}
          clients={visibleClients}
          canManageAssignments={isAdmin}
          onAssignClient={handleAssignClient}
        />
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
