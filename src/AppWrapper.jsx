import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./utils/toast/toast.css";

import { Suspense, lazy } from "react";

// Lazy load components
const NotFound = lazy(() => import("./components/not-found/NotFound"));
const AuthenticatedLayout = lazy(() =>
  import("./layout/authenticated/AuthenticatedLayout")
);
const AllAppointments = lazy(() =>
  import("./pages/appointsments/AllAppointments")
);
const AppointmentDetails = lazy(() =>
  import("./pages/appointsments/AppointmentDetails")
);
const AuthPage = lazy(() => import("./pages/authpage/AuthPage"));
const BookAppointment = lazy(() =>
  import("./pages/bookAppointment/BookAppointment")
);
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const MedicalForm = lazy(() => import("./pages/medicalForm/MedicalForm"));
const RequireAuth = lazy(() => import("./routes/RouteGuard"));
const DynamicForms = lazy(() => import("./pages/forms/DymamicForms"));

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;

    let artistId = null;

    // Extract artistId from hash (e.g., "#/artistId")
    if (hash.startsWith("#/")) {
      artistId = hash.substring(2); // Remove "#/"
    }

    // Store artistId in localStorage if found
    if (artistId) {
      console.log("Extracted Artist ID:", artistId);
      localStorage.setItem("artistId", artistId);
    }
  }, [location]);

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

      <Suspense fallback={<div>Loading...</div>}>
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
            <Route
              path="/book-appointments/:id"
              element={<BookAppointment />}
            />
            <Route path="/medical-form" element={<MedicalForm />} />
            <Route path="/appointments" element={<AllAppointments />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route
              path="/forms/services/:serviceIds/artist/:artistId/appointment/:appointmentId"
              element={<DynamicForms />}
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default AppWrapper;
