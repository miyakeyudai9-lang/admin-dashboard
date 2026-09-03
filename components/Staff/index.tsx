"use client";

import { useRouter } from "next/navigation";
import { useStaffList } from "./hook";
import type { StaffRowItem } from "./staff.type";

export default function StaffTable() {
  const router = useRouter();
  const { data: staffs = [], isLoading: loading } = useStaffList();

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
                <th className="text-left px-5 py-4 font-semibold">Role</th>
                <th className="text-left px-5 py-4 font-semibold">Status</th>
                <th className="text-left px-5 py-4 font-semibold">Created</th>
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
      <td className="px-5 py-4 capitalize text-gray-600">{staff.role}</td>
      <td className="px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            staff.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {staff.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-5 py-4 text-gray-600">
        {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : "N/A"}
      </td>

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
