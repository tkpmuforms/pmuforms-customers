import { CircularProgress } from "@mui/material";
import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/not-found/NotFound";
import useAuth from "../context/useAuth";
import AuthenticatedLayout from "../layout/authenticated/AuthenticatedLayout";
import { authorizedRoutes, nonAuthRoutes } from "./RouteConfig";

const SaveAndRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fullPath = location.pathname;
    const pathSegments = fullPath.split("/").filter(Boolean);
    const businessUri = pathSegments[0];

    if (fullPath && fullPath !== "/") {
      localStorage.setItem("redirectAfterLogin", fullPath);
    }

    if (businessUri) {
      navigate(`/${businessUri}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return null;
};

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
      {nonAuthRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {isAuthenticated &&
        authorizedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={displayElement(route)}
          />
        ))}

      {isAuthenticated ? (
        <Route key="not-found" path="*" element={<NotFound />} />
      ) : (
        <Route key="auth-redirect" path="*" element={<SaveAndRedirect />} />
      )}
    </Routes>
  );
};

export default RouteWrapper;
