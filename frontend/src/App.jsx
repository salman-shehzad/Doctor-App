import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import DoctorList from './pages/doctors/DoctorList';
import DoctorProfile from './pages/doctors/DoctorProfile';
import BookAppointment from './pages/booking/BookAppointment';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import AssistantDashboard from './pages/dashboard/AssistantDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import AppointmentDetail from './pages/appointments/AppointmentDetail';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/doctors/:id" element={<DoctorProfile />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute roles={['patient']} />}>
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['doctor']} />}>
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['assistant']} />}>
        <Route path="/dashboard/assistant" element={<AssistantDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['super_admin']} />}>
        <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/appointments/:id" element={<AppointmentDetail />} />
      </Route>
    </Routes>
  </Layout>
);

export default App;
