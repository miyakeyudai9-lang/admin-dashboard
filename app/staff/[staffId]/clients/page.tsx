"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ReusableTable from "@/components/ReusableTable";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
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

type ClientApiResponse = {
  _id?: string;
  clientId?: number | string;
  fullName?: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
};

type StaffApiResponse = {
  _id?: string;
  staffId?: number | string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
};

type StaffClientRecord = {
  _id?: string;
  clientId: number;
  fullName: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaffId?: string | number;
  assignedStaffName?: string;
};

export default function StaffClientsPage() {
  return (
    <Suspense fallback={<StaffClientsFallback />}>
      <StaffClientsPageContent />
    </Suspense>
  );
}

function StaffClientsPageContent() {
  const router = useRouter();
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [staffs, setStaffs] = useState<StaffRecord[]>([]);
  const [clients, setClients] = useState<StaffClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffClients = async () => {
      try {
        const staffResponse = await api.get("/staff");
        const staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [];
        const mappedStaffs = staffList.map((staff: StaffApiResponse) => ({
          _id: staff._id,
          id: staff.staffId ?? staff._id,
          staffId: staff.staffId,
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          location: staff.location,
        }));

        const selectedStaff =
          mappedStaffs.find(
            (staff: StaffRecord) =>
              String(staff._id) === staffId ||
              String(staff.staffId) === staffId ||
              String(staff.id) === staffId,
          ) ?? null;

        const clientResponse = await api.get(
          `/clients/staff/${selectedStaff?._id ?? staffId}`,
        );
        const rawClients = Array.isArray(clientResponse.data?.data)
          ? clientResponse.data.data
          : Array.isArray(clientResponse.data)
            ? clientResponse.data
            : [];

        setStaffs(mappedStaffs);
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
            assignedStaffId: selectedStaff?._id ?? staffId,
            assignedStaffName: selectedStaff?.name ?? "Assigned Staff",
          })),
        );
      } catch (error) {
        console.error("Failed to load staff clients", error);
        setStaffs([]);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadStaffClients();
  }, [staffId]);

  const selectedStaff = useMemo(
    () =>
      staffs.find(
        (staff) =>
          String(staff._id) === staffId ||
          String(staff.staffId) === staffId ||
          String(staff.id) === staffId,
      ) ?? null,
    [staffId, staffs],
  );

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

  const handleUpdateClientField = (
    clientId: number,
    field: "coeStatus" | "visaStatus" | "clientStatus",
    value: string,
  ) => {
    setClients((previous) =>
      previous.map((client) =>
        client.clientId === clientId
          ? {
              ...client,
              [field]: value,
            }
          : client,
      ),
    );
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
        <Navbar title={`${selectedStaff?.name ?? "Staff"} Clients`} />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
              {
                label: selectedStaff?.name ?? "Staff Clients",
                href: `/staff/${staffId}/clients`,
                current: true,
              },
            ]}
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading assigned clients...
          </div>
        ) : (
          <ReusableTable
            title={`${selectedStaff?.name ?? "Staff"} Clients`}
            variant="staff"
            clients={clients}
            staffs={staffs.map((staff) => ({
              id: staff._id ?? staff.id ?? staff.staffId ?? 0,
              name: staff.name,
              _id: staff._id,
            }))}
            onUpdateClientField={handleUpdateClientField}
          />
        )}
      </main>
    </div>
  );
}

function StaffClientsFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}
