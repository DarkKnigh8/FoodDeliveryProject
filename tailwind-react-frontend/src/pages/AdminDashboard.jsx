import React from 'react';

export default function RoleButtons() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashbord Role</h1>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Delivery
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Restaurant Registration
        </button>
      </div>
    </div>
  );
}
