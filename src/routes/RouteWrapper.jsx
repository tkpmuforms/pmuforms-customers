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

  return (
    <Routes>
      {isAuthenticated ? (
        <Route
          key="auth-redirect"
          path="*"
          element={<Navigate to="/dashboard" />}
        />
      ) : (
        nonAuthRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))
      )}

      {isAuthenticated &&
        authorizedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={displayElement(route)}
          />
        ))}
      {isAuthenticated && (
        <Route key="not-found" path="*" element={<NotFound />} />
      )}
      {!isAuthenticated && (
        <Route key="auth-redirect" path="*" element={<Navigate to="/auth" />} />
      )}
    </Routes>
  );
};

export default RouteWrapper;
