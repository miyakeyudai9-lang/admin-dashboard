"use client";

import { useRouter } from "next/navigation";
import { staffData } from "./staff.type";

export default function StaffTable() {
  const router = useRouter();

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-bold mb-5">Staff List</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Phone</th>
            <th className="text-left p-3">Location</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {staffData.map((staff) => (
            <tr key={staff.id} className="border-b">
              <td className="p-3">{staff.id}</td>
              <td className="p-3">{staff.name}</td>
              <td className="p-3">{staff.phone}</td>
              <td className="p-3">{staff.location}</td>
              <td className="p-3">{staff.email}</td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => router.push(`/client?staffId=${staff.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
