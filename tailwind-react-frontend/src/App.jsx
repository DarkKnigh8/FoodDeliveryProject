import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Home from './pages/Home';
import UserRestaurantMenu from './pages/UserRestaurantMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashbord from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute';


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
        <Route path="/adminDashboard" element={<AdminDashbord />} />

        
        
      </Routes>
    </BrowserRouter>
  );
}




export default App;



/*export default function App() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-blue-600 underline">
        Tailwind is working!
      </h1>
    </div>
  );
}*/

