import { lazy } from "react";
import AuthPage from "../pages/authpage/AuthPage";
import VerifyEmailForm from "../pages/authpage/authsubfolders/verifyEmail/VerifyEmailForm";
import ContactSupport from "../pages/contact-us/ContactUs";
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy";
import TermsAndAgreement from "../pages/termsandAgreement/TermsAndAgreement";
import { BREADCRUMBS, ROUTE_PATHS } from "./routes";

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
  // Static routes first
  {
    path: ROUTE_PATHS.PRIVACY_POLICY,
    element: <PrivacyPolicy />,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.SUPPORT,
    element: <ContactSupport />,
    breadcrumbs: BREADCRUMBS.CONTACT_SUPPORT,
  },
  {
    path: ROUTE_PATHS.TERMS_AND_AGREEMENT,
    element: <TermsAndAgreement />,
    breadcrumbs: BREADCRUMBS.TERMS_AND_AGREEMENT,
  },
  // Dynamic business URI route comes after static routes
  {
    path: "/:businessUri",
    element: <AuthPage />,
    breadcrumbs: [],
  },

  {
    path: "/",
    element: <AuthPage />,
    breadcrumbs: [],
  },

];

export const authorizedRoutes = [
  {
    path: ROUTE_PATHS.CUSTOMER_DASHBOARD,
    element: <Dashboard />,
    breadcrumbs: BREADCRUMBS.DASHBOARD,
  },
  {
    path: "/customer/dashboard",
    element: <Dashboard />,
    breadcrumbs: BREADCRUMBS.DASHBOARD,
  },
  {
    path: ROUTE_PATHS.VERIFY_EMAIL,
    element: <VerifyEmailForm />,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.BOOK_APPOINTMENT,
    element: <BookAppointment />,
    breadcrumbs: ["New Form"],
  },
  {
    path: ROUTE_PATHS.CUSTOMER_SUPPORT,
    element: <ContactSupportAuth />,
    breadcrumbs: BREADCRUMBS.CONTACT_SUPPORT,
  },
  {
    path: ROUTE_PATHS.APPOINTMENTS,
    element: <AllAppointments />,
    breadcrumbs: ["Appointment Forms"],
  },
  {
    path: ROUTE_PATHS.APPOINTMENT_DETAILS,
    element: <AppointmentDetails />,
    breadcrumbs: ["Appointment Forms", "Details"],
  },
  {
    path: ROUTE_PATHS.DYNAMIC_FORMS,
    element: <DynamicForms />,
    breadcrumbs: BREADCRUMBS.DYNAMIC_FORMS,
  },
  {
    path: ROUTE_PATHS.FILLED_FORMS,
    element: <FilledForms />,
    breadcrumbs: BREADCRUMBS.FILLED_FORMS,
  },
];
