import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Home from './pages/Home';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashbord from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';

import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-100 min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/restaurantDashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurants/:id" element={<UserRestaurantMenu />} />
          <Route path="/adminDashboard" element={<AdminDashbord />} />

          <Route
            path="/createorder"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CreateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
