import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdvocateDashboardPage from './pages/AdvocateDashboardPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RequestAccessPage from './pages/RequestAccessPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ExpertisePage from './pages/ExpertisePage';
import TestimonialsPage from './pages/TestimonialsPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/expertise" element={<ExpertisePage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/request-access" element={<RequestAccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Password change */}
      <Route element={<ProtectedRoute allowPasswordChangeOnly />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Client dashboard*/}
      <Route element={<ProtectedRoute roles={['client']} />}>
        <Route path="/client" element={<AccountPage />} />
      </Route> 

      {/* Advocate dashboard */}
      <Route element={<ProtectedRoute roles={['advocate']} />}>
        <Route path="/advocate" element={<AdvocateDashboardPage />} />
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Legacy /account redirect to role home */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;



// import { Navigate, Route, Routes } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicOnlyRoute from './components/PublicOnlyRoute';
// import AccountPage from './pages/AccountPage';
// import AdminDashboardPage from './pages/AdminDashboardPage';
// import ChangePasswordPage from './pages/ChangePasswordPage';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import RequestAccessPage from './pages/RequestAccessPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import AboutPage from './pages/AboutPage';
// import ServicesPage from './pages/ServicesPage';
// import ExpertisePage from './pages/ExpertisePage';
// import TestimonialsPage from './pages/TestimonialsPage';
// import TeamPage from './pages/TeamPage';
// import ContactPage from './pages/ContactPage';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/services" element={<ServicesPage />} />
//       <Route path="/expertise" element={<ExpertisePage />} />
//       <Route path="/testimonials" element={<TestimonialsPage />} />
//       <Route path="/team" element={<TeamPage />} />
//       <Route path="/contact" element={<ContactPage />} />

//       <Route element={<PublicOnlyRoute />}>
//         <Route path="/request-access" element={<RequestAccessPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//       </Route>

//       <Route element={<ProtectedRoute allowPasswordChangeOnly />}>
//         <Route path="/change-password" element={<ChangePasswordPage />} />
//       </Route>

//       <Route element={<ProtectedRoute />}>
//         <Route path="/account" element={<AccountPage />} />
//       </Route>

//       <Route element={<ProtectedRoute roles={['admin']} />}>
//         <Route path="/admin" element={<AdminDashboardPage />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;