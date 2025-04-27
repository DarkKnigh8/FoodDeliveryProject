import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandDes from './components/LandDes';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import DeliveryTracker from './pages/DeliveryTracker';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import RestaurantDashboard from './pages/RestaurantDashboard';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import AdminResRegistration from './pages/AdminResRegistration';
import ManageOrders from './pages/ManageOrders';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandDes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/restaurantDashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurants/:id" element={<UserRestaurantMenu />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/track/:id" element={<DeliveryTracker />} /> {/* ✅ Only /track/:id */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/resReg" element={<AdminResRegistration />} />
            <Route path="/restaurants/:restaurantId/orders" element={<ManageOrders />} />
            <Route path="/createorder" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CreateOrder />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
