"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

type ApiStaff = {
  _id?: string;
  staffId?: number | string;
  name: string;
  phone?: string;
  location?: string;
  email?: string;
  totalClients?: number;
};

type StaffRowItem = {
  id: number | string;
  recordId?: string;
  name: string;
  phone: string;
  location: string;
  email: string;
  clientsCount: number;
};

export default function StaffTable() {
  const router = useRouter();
  const [staffs, setStaffs] = useState<StaffRowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffs = async () => {
      try {
        const response = await api.get("/staff");
        const data = Array.isArray(response.data) ? response.data : [];

        const mapped = data.map((staff: ApiStaff) => ({
          id: staff.staffId ?? staff._id ?? "N/A",
          recordId: staff._id,
          name: staff.name ?? "Unknown Staff",
          phone: staff.phone ?? "N/A",
          location: staff.location ?? "N/A",
          email: staff.email ?? "N/A",
          clientsCount: Number(staff.totalClients ?? 0),
        }));

        setStaffs(mapped);
      } catch (error) {
        console.error("Failed to load staff", error);
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };

    loadStaffs();
  }, []);

  const goToClients = (staff: StaffRowItem) =>
    router.push(`/staff/${staff.recordId ?? staff.id}/clients`);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Staff List</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff members and their assigned clients
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Loading staff...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="text-left px-5 py-4 font-semibold">ID</th>
                <th className="text-left px-5 py-4 font-semibold">Name</th>
                <th className="text-left px-5 py-4 font-semibold">Phone</th>
                <th className="text-left px-5 py-4 font-semibold">Location</th>
                <th className="text-left px-5 py-4 font-semibold">Email</th>
                <th className="text-left px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {staffs.map((staff) => (
                <StaffRow key={String(staff.recordId ?? staff.id)} staff={staff} onViewClients={goToClients} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StaffRow({
  staff,
  onViewClients,
}: {
  staff: StaffRowItem;
  onViewClients: (staff: StaffRowItem) => void;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-blue-50/50 transition-colors">
      <td className="px-5 py-4 text-gray-700">#{staff.id}</td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onViewClients(staff)}
          className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
        >
          {staff.name}
        </button>
      </td>

      <td className="px-5 py-4 text-gray-600">{staff.phone}</td>
      <td className="px-5 py-4 text-gray-600">{staff.location}</td>
      <td className="px-5 py-4 text-gray-600">{staff.email}</td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onViewClients(staff)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          View Clients
        </button>
      </td>
    </tr>
  );
}
