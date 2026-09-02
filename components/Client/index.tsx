import type { Client } from "../Staff/staff.type";

type ClientTableProps = {
  staffName: string;
  clients: Client[];
};

export default function ClientTable({ staffName, clients }: ClientTableProps) {
  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-bold mb-5">Clients for {staffName}</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Client Name</th>
            <th className="text-left p-3">Phone</th>
            <th className="text-left p-3">Location</th>
            <th className="text-left p-3">Email</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b">
              <td className="p-3">{client.id}</td>
              <td className="p-3">{client.name}</td>
              <td className="p-3">{client.phone}</td>
              <td className="p-3">{client.location}</td>
              <td className="p-3">{client.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
