import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authpage/AuthPage";
import "./utils/toast/toast.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/Dashboard";
import BookAppointment from "./pages/bookAppointment/BookAppointment";
import "./index.css";
import MedicalForm from "./pages/medicalForm/MedicalForm";
import AllAppointments from "./pages/appointsments/AllAppointments";
import AppointmentDetails from "./pages/appointsments/AppointmentDetails";

function App() {
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
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-appointments" element={<BookAppointment />} />
          <Route path="/medical-form" element={<MedicalForm />} />
          <Route path="/appointments" element={<AllAppointments />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
