"use client";

import { useRouter } from "next/navigation";
import { staffData, type Staff } from "./staff.type";

export default function StaffTable() {
  const router = useRouter();

  const goToClients = (staffId: Staff["id"]) =>
    router.push(`/client?staffId=${staffId}`);

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

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="text-left px-5 py-4 font-semibold">ID</th>
              <th className="text-left px-5 py-4 font-semibold">Name</th>
              <th className="text-left px-5 py-4 font-semibold">Phone</th>
              <th className="text-left px-5 py-4 font-semibold">Location</th>
              <th className="text-left px-5 py-4 font-semibold">Email</th>
              <th className="text-left px-5 py-4 font-semibold">Total Clients</th>
              <th className="text-left px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {staffData.map((staff) => (
              <StaffRow key={staff.id} staff={staff} onViewClients={goToClients} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffRow({
  staff,
  onViewClients,
}: {
  staff: Staff;
  onViewClients: (staffId: Staff["id"]) => void;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-blue-50/50 transition-colors">
      <td className="px-5 py-4 text-gray-700">#{staff.id}</td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onViewClients(staff.id)}
          className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
        >
          {staff.name}
        </button>
      </td>

      <td className="px-5 py-4 text-gray-600">{staff.phone}</td>
      <td className="px-5 py-4 text-gray-600">{staff.location}</td>
      <td className="px-5 py-4 text-gray-600">{staff.email}</td>

      <td className="px-5 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
          {staff.clients.length} Clients
        </span>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onViewClients(staff.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          View Clients
        </button>
      </td>
    </tr>
  );
}