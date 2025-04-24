import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Home from './pages/Home';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
<<<<<<< HEAD
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryTracker from './pages/DeliveryTracker'; 
import DriverDashboard from './pages/DriverDashboard'; // Driver Dashboard Page
=======
import AdminDashbord from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminResRegistration from './pages/AdminResRegistration';
import ManageOrders from './pages/ManageOrders';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder'; // Ensure this file exists
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
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
=======
      <div className="p-4 bg-gray-100 min-h-screen">
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
            <Route path="/adminDashboard" element={<AdminDashbord />} />
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

            {/* Checkout Route */}
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <Footer />
      </div>
>>>>>>> 49486bf853f9d5ca0ad6582ac3250bdcf55a34e9
    </BrowserRouter>
  );
}

export default App;
