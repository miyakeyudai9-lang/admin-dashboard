import React from "react";

const staffData = [
  {
    name: "Ram Sharma",
    clients: 32,
    status: "Active",
  },
  {
    name: "Hari Thapa",
    clients: 25,
    status: "Active",
  },
  {
    name: "Sita Rai",
    clients: 18,
    status: "Inactive",
  },
];

export default function DashboardComponentnent() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-2xl font-bold mb-8">
          Fortune Link
        </h1>

        <ul className="space-y-4">
          <li className="font-semibold">
            Dashboard
          </li>

          <li>
            Staff Management
          </li>

          <li>
            Clients
          </li>

          <li>
            Reports
          </li>

          <li>
            Settings
          </li>
        </ul>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Admin Dashboard
          </h2>

          <button className="bg-black text-white px-5 py-2 rounded">
            Logout
          </button>
        </div>


        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-gray-500">
              Total Staff
            </h3>

            <p className="text-3xl font-bold">
              10
            </p>
          </div>


          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-gray-500">
              Total Clients
            </h3>

            <p className="text-3xl font-bold">
              250
            </p>
          </div>


          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-gray-500">
              Active Projects
            </h3>

            <p className="text-3xl font-bold">
              75
            </p>
          </div>

        </div>


        {/* Staff Table */}
        <div className="bg-white rounded shadow p-6">

          <h3 className="text-xl font-bold mb-5">
            Staff List
          </h3>


          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  Name
                </th>

                <th className="text-left p-3">
                  Clients
                </th>

                <th className="text-left p-3">
                  Status
                </th>

                <th className="text-left p-3">
                  Action
                </th>

              </tr>
            </thead>


            <tbody>

              {staffData.map((staff,index)=>(
                <tr key={index} className="border-b">

                  <td className="p-3">
                    {staff.name}
                  </td>

                  <td className="p-3">
                    {staff.clients}
                  </td>

                  <td className="p-3">
                    {staff.status}
                  </td>

                  <td className="p-3">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">
                      View
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>


        {/* Activity */}
        <div className="bg-white rounded shadow p-6 mt-8">

          <h3 className="text-xl font-bold mb-4">
            Recent Activities
          </h3>

          <ul className="space-y-3">

            <li>
              Ram updated ABC Pvt Ltd details
            </li>

            <li>
              Admin assigned XYZ Company to Hari
            </li>

            <li>
              New client added by Sita
            </li>

          </ul>

        </div>


      </main>

    </div>
  );
}