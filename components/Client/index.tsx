import Link from "next/link";
import { staffData, type Client } from "../Staff/staff.type";

type ClientTableProps = {
  title: string;
  clients: Client[];
  canManageAssignments?: boolean;
  onAssignClient?: (clientId: number, staffId: number) => void;
};

export default function ClientTable({
  title,
  clients,
  canManageAssignments = false,
  onAssignClient,
}: ClientTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 text-left font-semibold">Client ID</th>
              <th className="p-3 text-left font-semibold">Client Name</th>
              <th className="p-3 text-left font-semibold">Assign To</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => {
              const assignedStaff = staffData.find(
                (staff) => staff.id === client.assignedStaffId,
              );

              return (
                <tr key={client.clientId} className="border-b last:border-none">
                  <td className="p-3 text-gray-700">#{client.clientId}</td>
                  <td className="p-3">
                    <Link
                      href={`/client/clientDetailPage?clientId=${client.clientId}`}
                      className="font-medium text-gray-900 transition-colors hover:text-blue-600"
                    >
                      {client.fullName}
                    </Link>
                  </td>
                  <td className="p-3">
                    {canManageAssignments ? (
                      <select
                        value={client.assignedStaffId ?? ""}
                        onChange={(event) =>
                          onAssignClient?.(
                            client.clientId,
                            Number(event.target.value),
                          )
                        }
                        className="min-w-44 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
                      >
                        {staffData.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {assignedStaff?.name ?? "Unassigned"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
