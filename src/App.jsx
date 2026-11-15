import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/overview/Overview'; 
import Companies from './pages/companies/companies';
import Trips from './pages/trips/Trips';
import Bookings from './pages/bookings/Bookings'; 
import Users from './pages/users/Users';
import Profile from './pages/profile/Profile'; 
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />      
      <Route element={<DashboardLayout />}>
      <Route path="/overview" element={<Overview />} />
      <Route path= "/companies" element= {<Companies/>}></Route>
      <Route path="/trips" element={<Trips />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;