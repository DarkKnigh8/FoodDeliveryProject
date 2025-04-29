import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleButtons() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 pt-20">
      <h1 className="text-3xl font-bold mb-10 text-center">Admin Dashboard Role</h1>

        <div className="flex flex-col gap-6 w-full max-w-xs">
        <button
          onClick={() => navigate('/delivery')}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Delivery
        </button>
        <button
          onClick={() => navigate('/resReg')}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Restaurant Registration
        </button>
        <button
          onClick={() => navigate('/admin/transactions')}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Financial Transactions
        </button>
      </div>
    </div>
  );
}
