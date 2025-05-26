export const BASE_URL = "/:businessUri";

export const ROUTE_PATHS = {
  // Non-authenticated routes (business URI required)
  BASE: `${BASE_URL}`,

  // Non-authenticated routes (no business URI required)
  PRIVACY_POLICY: `/privacy-policy`,
  SUPPORT: `/support`,
  TERMS_AND_AGREEMENT: `/terms-and-agreement`,

  // Authenticated routes (business URI required)
  VERIFY_EMAIL: `${BASE_URL}/verify-email`,
  CUSTOMER_DASHBOARD: `${BASE_URL}/customer/dashboard`,
  BOOK_APPOINTMENT: `${BASE_URL}/customer/book-appointments/:id`,
  CUSTOMER_SUPPORT: `${BASE_URL}/customer/support`,
  APPOINTMENTS: `${BASE_URL}/customer/appointments`,
  APPOINTMENT_DETAILS: `${BASE_URL}/customer/appointments/:id`,
  DYNAMIC_FORMS: `${BASE_URL}/customer/forms/appointment/:appointmentId`,
  FILLED_FORMS: `${BASE_URL}/customer/filled-forms/appointment/:id`,

  // Catch all
  NOT_FOUND: `*`,
};

export const BREADCRUMBS = {
  CONTACT_SUPPORT: ["Contact Support"],
  TERMS_AND_AGREEMENT: ["Terms and Agreement"],
  DASHBOARD: ["Dashboard"],
  DASHBOARD_ARTIST: ["Dashboard", "Artist"],
  BOOK_APPOINTMENT: ["Book Appointment"],
  APPOINTMENTS: ["Appointments"],
  APPOINTMENT_DETAILS: ["Appointments", "Details"],
  DYNAMIC_FORMS: ["Dynamic Forms"],
  FILLED_FORMS: ["Filled Forms"],
};

// Complete route configurations for easy import
export const NON_AUTH_ROUTES = [
  {
    path: ROUTE_PATHS.ROOT,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.BASE,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.PRIVACY_POLICY,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.SUPPORT,
    breadcrumbs: BREADCRUMBS.CONTACT_SUPPORT,
  },
  {
    path: ROUTE_PATHS.TERMS_AND_AGREEMENT,
    breadcrumbs: BREADCRUMBS.TERMS_AND_AGREEMENT,
  },
];

export const AUTHORIZED_ROUTES = [
  {
    path: ROUTE_PATHS.ROOT,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.VERIFY_EMAIL,
    breadcrumbs: [],
  },
  {
    path: ROUTE_PATHS.CUSTOMER_DASHBOARD,
    breadcrumbs: BREADCRUMBS.DASHBOARD,
  },
  {
    path: ROUTE_PATHS.BOOK_APPOINTMENT,
    breadcrumbs: BREADCRUMBS.BOOK_APPOINTMENT,
  },
  {
    path: ROUTE_PATHS.CUSTOMER_SUPPORT,
    breadcrumbs: BREADCRUMBS.CONTACT_SUPPORT,
  },
  {
    path: ROUTE_PATHS.APPOINTMENTS,
    breadcrumbs: BREADCRUMBS.APPOINTMENTS,
  },
  {
    path: ROUTE_PATHS.APPOINTMENT_DETAILS,
    breadcrumbs: BREADCRUMBS.APPOINTMENT_DETAILS,
  },
  {
    path: ROUTE_PATHS.DYNAMIC_FORMS,
    breadcrumbs: BREADCRUMBS.DYNAMIC_FORMS,
  },
  {
    path: ROUTE_PATHS.FILLED_FORMS,
    breadcrumbs: BREADCRUMBS.FILLED_FORMS,
  },
];

// All routes combined
export const ALL_ROUTES = [...NON_AUTH_ROUTES, ...AUTHORIZED_ROUTES];

// Helper functions
export const getRouteByPath = (path) => {
  return ALL_ROUTES.find((route) => route.path === path);
};

export const getRoutePath = (routeKey) => {
  return ROUTE_PATHS[routeKey];
};

// Navigation helpers
export const buildCustomerRoute = (subPath) => {
  return `${BASE_URL}/customer${subPath}`;
};

export const buildAppointmentRoute = (appointmentId) => {
  return ROUTE_PATHS.BOOK_APPOINTMENT.replace(":id", appointmentId);
};

export const buildAppointmentDetailsRoute = (appointmentId) => {
  return ROUTE_PATHS.APPOINTMENT_DETAILS.replace(":id", appointmentId);
};

export const buildDynamicFormsRoute = (appointmentId) => {
  return ROUTE_PATHS.DYNAMIC_FORMS.replace(":appointmentId", appointmentId);
};

export const buildFilledFormsRoute = (appointmentId) => {
  return ROUTE_PATHS.FILLED_FORMS.replace(":id", appointmentId);
};
