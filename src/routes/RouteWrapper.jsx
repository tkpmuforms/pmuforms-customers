import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import AuthenticatedLayout from "../layout/authenticated/AuthenticatedLayout";
import { authorizedRoutes, nonAuthRoutes } from "./RouteConfig";
import NotFound from "../components/not-found/NotFound";
import useAuth from "../context/useAuth";

const RouteWrapper = () => {
  const { isAuthenticated } = useAuth();
  const displayElement = ({ element, layout, breadcrumbs, showAds }) => {
    return (
      <AuthenticatedLayout
        {...layout}
        breadcrumb={breadcrumbs}
        showAds={showAds}
      >
        <Suspense
          fallback={
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          }
        >
          {element}
        </Suspense>
      </AuthenticatedLayout>
    );
  };

  console.log("User Authenticated:", isAuthenticated);
  console.log("Non-Auth Routes:", nonAuthRoutes);

  return (
    <Routes>
      {/* ✅ Ensure unauthenticated users can access public pages */}
      {nonAuthRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* ✅ Only authenticated users can access protected routes */}
      {isAuthenticated &&
        authorizedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={displayElement(route)}
          />
        ))}

      {/* ✅ Catch-all route: If authenticated, redirect to dashboard, else show 404 */}
      {isAuthenticated ? (
        <Route key="not-found" path="*" element={<NotFound />} />
      ) : (
        <Route key="auth-redirect" path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
};

export default RouteWrapper;
