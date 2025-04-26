import React, { useEffect, useState } from 'react';
import { fetchAllTransactions, fetchFilteredTransactions } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable directly


export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await fetchAllTransactions(token);
    setTransactions(data);
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setLoading(true);
    const data = await fetchFilteredTransactions(filters, token);
    setTransactions(data);
    setLoading(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 16);
  
    const tableColumn = ["Transaction ID", "Amount", "Currency", "Status", "Date"];
    const tableRows = transactions.map(tx => [
      tx._id,
      tx.amount,
      tx.currency,
      tx.paymentStatus,
      new Date(tx.createdAt).toLocaleString()
    ]);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });
  
    doc.save('transactions.pdf');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2"
        />
        <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded">
          Filter
        </button>
        <button onClick={loadTransactions} className="bg-gray-500 text-white px-4 py-2 rounded">
          Reset
        </button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Transaction ID</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Currency</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="border px-4 py-2">{tx._id}</td>
                <td className="border px-4 py-2">{tx.amount}</td>
                <td className="border px-4 py-2">{tx.currency}</td>
                <td className="border px-4 py-2">{tx.paymentStatus}</td>
                <td className="border px-4 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
