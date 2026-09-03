"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReusableTable from "@/components/ReusableTable";
import Breadcrumb from "@/components/Breadcrumb";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import { api } from "@/lib/axios";

type StaffRecord = {
  _id?: string;
  id?: number | string;
  staffId?: number | string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
};

type ClientRecord = {
  _id?: string;
  clientId: number;
  fullName: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaff?: StaffRecord | string | null;
  assignedStaffId?: number | string | null;
  assignedStaffName?: string;
};

type StaffApiResponse = {
  _id?: string;
  staffId?: number | string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
};

type ClientApiResponse = {
  _id?: string;
  clientId?: number | string;
  fullName?: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaff?: StaffApiResponse | string | null;
};

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
  const [staffs, setStaffs] = useState<StaffRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [staffResponse, clientResponse] = await Promise.all([
          api.get("/staff"),
          api.get("/clients"),
        ]);

        const staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [];
        const rawClients = Array.isArray(clientResponse.data?.data)
          ? clientResponse.data.data
          : Array.isArray(clientResponse.data)
            ? clientResponse.data
            : [];

        setStaffs(
          staffList.map((staff: StaffApiResponse) => ({
            _id: staff._id,
            id: staff.staffId ?? staff._id ?? 0,
            staffId: staff.staffId,
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            location: staff.location,
          })),
        );

        setClients(
          rawClients.map((client: ClientApiResponse) => ({
            _id: client._id,
            clientId: Number(client.clientId ?? 0),
            fullName: client.fullName ?? "Unknown Client",
            phone: client.phone,
            visaType: client.visaType,
            coeStatus: client.coeStatus,
            visaStatus: client.visaStatus,
            clientStatus: client.clientStatus,
            assignedStaff: client.assignedStaff,
            assignedStaffId:
              typeof client.assignedStaff === "object" && client.assignedStaff
                ? client.assignedStaff._id ?? null
                : client.assignedStaff ?? null,
            assignedStaffName:
              typeof client.assignedStaff === "object" && client.assignedStaff
                ? client.assignedStaff.name ?? "Unassigned"
                : "Unassigned",
          })),
        );
      } catch (error) {
        console.error("Failed to load staff and client data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const visibleClients = useMemo(() => clients, [clients]);

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

  const handleAssignClient = async (clientId: number, staffId: number | string) => {
    const selectedClient = clients.find((client) => Number(client.clientId) === Number(clientId));
    if (!selectedClient?._id) return;

    const selectedStaff = staffs.find(
      (staff) => String(staff._id ?? staff.id ?? staff.staffId) === String(staffId),
    );

    if (!selectedStaff) return;

    try {
      await api.put(`/clients/assign/${selectedClient._id}`, {
        staffId: selectedStaff._id ?? selectedStaff.id,
      });

      setClients((previous) =>
        previous.map((client) =>
          client._id === selectedClient._id
            ? {
                ...client,
                assignedStaff: selectedStaff,
                assignedStaffId: selectedStaff._id ?? selectedStaff.id ?? null,
                assignedStaffName: selectedStaff.name,
              }
            : client,
        ),
      );
    } catch (error) {
      console.error("Failed to assign client to staff", error);
    }
  };

  const handleAddClient = () => {
    router.push("/client/clientDetailPage?mode=create");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          selected="Clients"
          onSelect={handleSidebarSelect}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading clients...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Clients"
        onSelect={handleSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title="Clients" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client", current: true },
            ]}
          />
        </div>

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

        <ReusableTable
          title="All Clients"
          variant="compact"
          clients={visibleClients.map((client) => ({
            clientId: Number(client.clientId ?? 0),
            fullName: client.fullName,
            assignedStaffId: client.assignedStaffId,
            assignedStaffName: client.assignedStaffName,
          }))}
          staffs={staffs.map((staff) => ({
            id: staff._id ?? staff.id ?? staff.staffId ?? 0,
            name: staff.name,
            _id: staff._id,
          }))}
          canManageAssignments
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
