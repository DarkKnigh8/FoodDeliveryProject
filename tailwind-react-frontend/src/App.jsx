import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Home from './pages/Home';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminResRegistration from './pages/AdminResRegistration';
import ManageOrders from './pages/ManageOrders';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
//import DeliveryTracker from './pages/DeliveryTracker'; // Ensure this file exists

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
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
            <Route path="/resReg" element={<AdminResRegistration />} />
            <Route path="/restaurants/:restaurantId/orders" element={<ManageOrders />} />

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
            <Route
              path="/track/:orderId"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <TrackOrder />
                </ProtectedRoute>
              }
            />
            {/* Delivery Service Integration */}
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/delivery-status/:deliveryId" element={<DeliveryTracker />} /> */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
