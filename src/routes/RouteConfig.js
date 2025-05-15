import { lazy } from "react";
import AuthPage from "../pages/authpage/AuthPage";
import NotFound from "../components/not-found/NotFound";
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy";
import ContactSupport from "../pages/contact-us/ContactUs";
import TermsAndAgreement from "../pages/termsandAgreement/TermsAndAgreement";
import VerifyEmailForm from "../pages/authpage/authsubfolders/verifyEmail/VerifyEmailForm";

const AllAppointments = lazy(() =>
  import("../pages/appointsments/AllAppointments")
);
const AppointmentDetails = lazy(() =>
  import("../pages/appoinmentDetails/AppointmentDetails")
);
const BookAppointment = lazy(() =>
  import("../pages/bookAppointment/BookAppointment")
);
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const DynamicForms = lazy(() => import("../pages/forms/DynamicForms"));
const ContactSupportAuth = lazy(() => import("../pages/contact-us/ContactUs"));
const FilledForms = lazy(() => import("../pages/filled-forms/FilledForms"));

export const nonAuthRoutes = [
  {
    path: "/",
    element: <AuthPage />,
    breadcrumbs: [],
  },
  {
    path: "/#/:businessUri",
    element: <AuthPage />,
    breadcrumbs: [],
  },
  {
    path: "*",
    element: <NotFound />,
    breadcrumbs: [],
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/support",
    element: <ContactSupport />,
    breadcrumbs: ["Contact Support"],
  },
  {
    path: "/terms-and-agreement",
    element: <TermsAndAgreement />,
    breadcrumbs: ["Terms and Agreement"],
  },
];

export const authorizedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    breadcrumbs: [],
  },
  {
    path: "/verify-email",
    element: <VerifyEmailForm />,
  },
  {
    path: "/customer/dashboard",
    element: <Dashboard />,
    breadcrumbs: ["Dashboard"],
  },
  {
    path: "/customer/dashboard/:businessUri",
    element: <Dashboard />,
    breadcrumbs: ["Dashboard", "Artist"],
  },
  {
    path: "/customer/book-appointments/:id",
    element: <BookAppointment />,
    breadcrumbs: ["Book Appointment"],
  },
  {
    path: "/customer/support",
    element: <ContactSupportAuth />,
    breadcrumbs: ["Contact Support"],
  },
  {
    path: "/customer/appointments",
    element: <AllAppointments />,
    breadcrumbs: ["Appointments"],
  },
  {
    path: "/customer/appointments/:id",
    element: <AppointmentDetails />,
    breadcrumbs: ["Appointments", "Details"],
  },
  {
    path: "/customer/forms/appointment/:appointmentId",
    element: <DynamicForms />,
    breadcrumbs: ["Dynamic Forms"],
  },
  {
    path: "/customer/filled-forms/appointment/:id",
    element: <FilledForms />,
    breadcrumbs: ["Filled Forms"],
  },
];
