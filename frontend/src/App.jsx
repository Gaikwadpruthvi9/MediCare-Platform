import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircleChevronUp } from "lucide-react";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
import Certification from "./components/Certification/Certification";
import HomeDoctors from "./components/HomeDoctors/HomeDoctors";
import ServicePage from "./components/ServicePage/ServicePage";
import Testimonial from "./components/Testimonial/Testimonial";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage";
import AppointmentPage from "./components/AppointmentPage/AppointmentPage";
import ContactPage from "./components/ContactPage/ContactPage";
import LoginPage from "./components/LoginPage/LoginPage";

// Pages
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import ServiceDetailPage from "./pages/ServiceDetailPage/ServiceDetailPage";

// Doctor Portal
import DoctorNavbar from "./doctor/Navbar/Navbar";
import DoctorDashboard from "./doctor/DashboardPage/DashboardPage";
import DoctorListPage from "./doctor/ListPage/ListPage";
import DoctorEditProfilePage from "./doctor/EditProfilePage/EditProfilePage";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"} 
      hover:scale-110 hover:shadow-xl cursor-pointer`}
      title="Go to top"
      aria-label="Scroll to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

// Home Page Layout
const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Banner />
      <Certification />
      <HomeDoctors previewCount={8} />
      <ServicePage previewCount={4} />
      <Testimonial />
    </main>
    <Footer />
  </>
);

// Standard Public Page Wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

// Doctor Admin Portal Layout
const DoctorLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <DoctorNavbar />
    <main>{children}</main>
  </div>
);

// Safe Clerk publishable key resolution
const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_bWVkaWNhcmUtZGVtby0wMS5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Toaster position="top-right" />
        <ToastContainer position="top-right" autoClose={3000} />
        <ScrollButton />

        <Routes>
          {/* Public Patient Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/doctors"
            element={
              <PublicLayout>
                <DoctorsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/doctors/:id"
            element={
              <PublicLayout>
                <DoctorDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <ServicePage />
              </PublicLayout>
            }
          />
          <Route
            path="/services/:id"
            element={
              <PublicLayout>
                <ServiceDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/appointments"
            element={
              <PublicLayout>
                <AppointmentPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* Doctor Portal Routes */}
          <Route path="/doctor-admin/login" element={<LoginPage />} />
          <Route
            path="/doctor-admin/:id"
            element={
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            }
          />
          <Route
            path="/doctor-admin/:id/appointments"
            element={
              <DoctorLayout>
                <DoctorListPage />
              </DoctorLayout>
            }
          />
          <Route
            path="/doctor-admin/:id/profile/edit"
            element={
              <DoctorLayout>
                <DoctorEditProfilePage />
              </DoctorLayout>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
