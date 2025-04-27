import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandDes from './components/LandDes';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RestaurantDashboard from './pages/RestaurantDashboard';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import DeliveryTracker from './pages/DeliveryTracker';
import DriverDashboard from './pages/DriverDashboard';
import AdminResRegistration from './pages/AdminResRegistration';
import ManageOrders from './pages/ManageOrders';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import AdminTransactions from './pages/AdminTransactions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandDes />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
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

            {/* Admin Routes */}
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/resReg" element={<AdminResRegistration />} />
            <Route path="/restaurants/:restaurantId/orders" element={<ManageOrders />} />

            {/* Customer Order Routes */}
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Delivery Tracker Route */}
            <Route path="/track/:id" element={<DeliveryTracker />} />

            {/* Driver Dashboard */}
            <Route path="/driver" element={<DriverDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
