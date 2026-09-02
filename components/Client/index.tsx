import Link from "next/link";

type ClientTableProps = {
  title: string;
  clients: Array<{
    clientId: number;
    fullName: string;
    assignedStaffId?: number | string | null;
    assignedStaffName?: string;
  }>;
  staffs?: Array<{ id?: number | string; name: string; _id?: string }>;
  canManageAssignments?: boolean;
  onAssignClient?: (clientId: number, staffId: number | string) => void;
};

export default function ClientTable({
  title,
  clients,
  staffs = [],
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
              const assignedStaff = staffs.find(
                (staff) =>
                  String(staff.id) === String(client.assignedStaffId ?? "") ||
                  String(staff._id) === String(client.assignedStaffId ?? ""),
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
                        value={String(client.assignedStaffId ?? "")}
                        onChange={(event) =>
                          onAssignClient?.(client.clientId, event.target.value)
                        }
                        className="min-w-44 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
                      >
                        {staffs.map((staff) => (
                          <option key={String(staff.id ?? staff._id)} value={String(staff.id ?? staff._id)}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {assignedStaff?.name ?? client.assignedStaffName ?? "Unassigned"}
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
