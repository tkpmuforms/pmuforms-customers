import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/not-found/NotFound";
import "./index.css";
import AuthenticatedLayout from "./layout/authenticated/AuthenticatedLayout";
import AllAppointments from "./pages/appointsments/AllAppointments";
import AppointmentDetails from "./pages/appointsments/AppointmentDetails";
import AuthPage from "./pages/authpage/AuthPage";
import BookAppointment from "./pages/bookAppointment/BookAppointment";
import Dashboard from "./pages/dashboard/Dashboard";
import MedicalForm from "./pages/medicalForm/MedicalForm";
import RequireAuth from "./routes/RouteGuard";
import "./utils/toast/toast.css";
import DynamicForms from "./pages/forms/DymamicForms";

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Extract ID from the hash
    const hash = location.hash; // Example: "#/jsb0kVT5ToNX5Q87H1tsglkDIh12"
    const artistId = hash.startsWith("#/") ? hash.substring(2) : null;

    if (artistId) {
      console.log("Extracted Artist ID:", artistId);
      localStorage.setItem("artistId", artistId);
    }
  }, [location.hash]);
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
        <Route
          element={
            <RequireAuth>
              <AuthenticatedLayout />
            </RequireAuth>
          }
        >
          {/* All routes below will share the DashboardLayout */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:artistId" element={<Dashboard />} />
          <Route path="/book-appointments/:id" element={<BookAppointment />} />
          <Route path="/medical-form" element={<MedicalForm />} />
          <Route path="/appointments" element={<AllAppointments />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route
            path="/forms/services/:serviceIds/artist/:artistId/appointment/:appointmentId"
            element={<DynamicForms />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default AppWrapper;
