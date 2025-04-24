import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Home from './pages/Home';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryTracker from './pages/DeliveryTracker'; 
import DriverDashboard from './pages/DriverDashboard'; // Driver Dashboard Page

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/track" element={<DeliveryTracker />} />
        <Route path="/track/:id" element={<DeliveryTracker />} />
        <Route path="/driver" element={<DriverDashboard />} />  {/* Driver Dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
