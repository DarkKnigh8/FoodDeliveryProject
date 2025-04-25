import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandDes from './components/LandDes';  // Import the LandDes component here
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
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandDes />} /> {/* Use LandDes component here */}
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
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
