export default function Navbar() {
  return (
    <div className="sticky top-0 z-10 mb-8 flex items-center justify-between border-b border-gray-200 bg-gray-100/90 px-4 py-4 backdrop-blur-sm">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      <button className="bg-black text-white px-5 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
