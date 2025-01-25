import { lazy } from "react";
import AuthPage from "../pages/authpage/AuthPage";
import NotFound from "../components/not-found/NotFound";

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
const ContactSupport = lazy(() => import("../pages/contact-us/ContactUs"));
const FilledForms = lazy(() => import("../pages/filled-forms/FilledForms"));

export const nonAuthRoutes = [
  {
    path: "/",
    element: <AuthPage />,
    breadcrumbs: [],
  },
  {
    path: "/#/:artistId",
    element: <AuthPage />,
    breadcrumbs: [],
  },
  {
    path: "*",
    element: <NotFound />,
    breadcrumbs: [],
  },
];

export const authorizedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    breadcrumbs: ["Dashboard"],
  },
  {
    path: "/dashboard/:artistId",
    element: <Dashboard />,
    breadcrumbs: ["Dashboard", "Artist"],
  },
  {
    path: "/book-appointments/:id",
    element: <BookAppointment />,
    breadcrumbs: ["Book Appointment"],
  },
  {
    path: "/support",
    element: <ContactSupport />,
    breadcrumbs: ["Contact Support"],
  },
  {
    path: "/appointments",
    element: <AllAppointments />,
    breadcrumbs: ["Appointments"],
  },
  {
    path: "/appointments/:id",
    element: <AppointmentDetails />,
    breadcrumbs: ["Appointments", "Details"],
  },
  {
    path: "/forms/appointment/:appointmentId",
    element: <DynamicForms />,
    breadcrumbs: ["Dynamic Forms"],
  },
  {
    path: "/filled-forms/appointment/:id",
    element: <FilledForms />,
    breadcrumbs: ["Filled Forms"],
  },
];
