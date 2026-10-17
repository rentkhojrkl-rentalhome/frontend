
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
         <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/requirements" element={<Requirements />} />

        </Routes>
        <Footer/ >
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
