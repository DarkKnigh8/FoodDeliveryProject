// src/pages/Register.jsx
import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.post('/register', form);
      alert('Registration successful. You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="relative">
        <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-blue-600"
        >
            {showPassword ? 'Hide' : 'Show'}
        </button>
        </div>
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
