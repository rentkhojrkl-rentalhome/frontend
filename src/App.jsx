import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import PostProperty from "./pages/PostProperty";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import Requirements from "./pages/Requirements";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerVerificationAdmin from "./pages/OwnerVerificationAdmin";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminOverview from "./pages/SuperAdmin/Overview";
import SuperAdminManagement from "./pages/SuperAdmin/Management";
import SuperAdminAdmins from "./pages/SuperAdmin/Admins";
import DownloadApp from "./pages/DownloadApp";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/download" element={<DownloadApp />} />
          <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

          <Route path="/super-admin" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<SuperAdminOverview />} />
            <Route path="users" element={<SuperAdminManagement type="users" />} />
            <Route path="owners" element={<SuperAdminManagement type="owners" />} />
            <Route path="tenants" element={<SuperAdminManagement type="tenants" />} />
            <Route path="admins" element={<SuperAdminAdmins />} />
            <Route path="properties" element={<SuperAdminManagement type="properties" />} />
            <Route path="rentals" element={<SuperAdminManagement type="rentals" />} />
            <Route path="verifications" element={<OwnerVerificationAdmin />} />
            <Route path="database" element={<SuperAdminManagement type="database" />} />
            <Route path="backups" element={<SuperAdminManagement type="backups" />} />
            <Route path="reports" element={<SuperAdminManagement type="reports" />} />
            <Route path="activity" element={<SuperAdminManagement type="activity" />} />
            <Route path="settings" element={<SuperAdminManagement type="settings" />} />
          </Route>
<Route
  path="/admin/owner-verifications"
  element={
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <OwnerVerificationAdmin />
    </ProtectedRoute>
  }
/>
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<main className="rk-page min-h-[60vh] px-4 py-20 text-center"><h1 className="text-3xl font-black">Page not found</h1><p className="mt-3 text-slate-600">The page you are looking for may have moved.</p><a href="/" className="mt-6 inline-flex rounded-full bg-emerald-950 px-5 py-3 font-bold text-white">Back to home</a></main>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

