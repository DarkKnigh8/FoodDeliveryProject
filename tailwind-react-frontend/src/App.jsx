import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandDes from './components/LandDes';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RestaurantDashboard from './pages/RestaurantDashboard';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import AdminDashboard from './pages/AdminDashboard';
import AdminResRegistration from './pages/AdminResRegistration';
import ManageOrders from './pages/ManageOrders';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
<<<<<<< HEAD
// import DeliveryTracker from './pages/DeliveryTracker'; // Assuming it's implemented
=======
import AdminTransactions from './pages/AdminTransactions';
// import DeliveryTracker from './pages/DeliveryTracker'; // Uncomment only if file exists
>>>>>>> 334057a18de5675463edb2499851cfd924699f55

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandDes />} /> {/* Use LandDes component here */}
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute allowedRoles={['customer','delivery']}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/restaurantDashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurants/:id" element={<UserRestaurantMenu />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
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
            <Route
              path="/track/:orderId"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <TrackOrder />
                </ProtectedRoute>
              }
            />

            {/* Checkout and Payment Routes */}
            <Route path="/checkout" element={<Checkout />} />
<<<<<<< HEAD
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Delivery Tracking */}
            {/* <Route path="/delivery-status/:deliveryId" element={<DeliveryTracker />} /> */}
=======
            {/* <Route path="/delivery-status/:deliveryId" element={<DeliveryTracker />} /> */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
>>>>>>> 334057a18de5675463edb2499851cfd924699f55
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
