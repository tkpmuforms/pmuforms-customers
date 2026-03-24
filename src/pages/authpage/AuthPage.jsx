import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLoginSvg } from "../../assets/svgs/AuthSvg";
import { useSnackbar } from "../../context/SnackbarContext";
import useAuth from "../../context/useAuth";
import { googleProvider } from "../../firebase/firebase";
import Navbar from "../../layout/public/Navbar";
import { ROUTE_PATHS } from "../../routes/routes";
import "./authpage.scss";
import LoginPage from "./authsubfolders/login/Login";
import SignupPage from "./authsubfolders/signUp/SignUp";
import { HandleSocialLogin } from "./authUtils";

const AuthPage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthSuccess, isAuthenticated } = useAuth();
  const { showAlert } = useSnackbar();

  const handlePageChange = (page) => setPage(page);

  // Business URI handling logic (non-authenticated only)
  useEffect(() => {
    if (isAuthenticated) return;
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const businessUri = location.pathname === "/" ? "" : pathSegments[0] || "";
    if (location.pathname === "/") {
      localStorage.removeItem("businessUri");
      return;
    }
    if (businessUri) {
      localStorage.setItem("businessUri", businessUri);
      if (location.pathname !== `/${businessUri}`) {
        navigate(`/${businessUri}`);
      }
    } else {
      navigate("/");
    }
  }, [location, isAuthenticated]);

  // Effect-based redirect for authenticated users — safe against React Strict Mode
  // (render-time removeItem caused double-render to see null and fall through to dashboard)
  useEffect(() => {
    if (!isAuthenticated) return;
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    } else {
      const rawUri = localStorage.getItem("businessUri");
      const businessAuthUri =
        rawUri && rawUri !== "null" && rawUri !== "undefined" ? rawUri : null;
      navigate(
        ROUTE_PATHS.CUSTOMER_DASHBOARD.replace(":businessUri", businessAuthUri),
        { replace: true }
      );
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return null;

  return (
    <>
      <Navbar CreatenewClick={() => handlePageChange("signup")} />
      <div className="auth-container">
        {page === "login" ? (
          <LoginPage />
        ) : (
          <SignupPage handlePageChange={handlePageChange} />
        )}
        <div className="switch-auth">
          {page === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => handlePageChange("signup")}
                className="switch-auth-button"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => handlePageChange("login")}
                className="switch-auth-button"
              >
                Log in
              </button>
            </p>
          )}
        </div>
        <p>Or sign in with</p>
        <div className="social-signin">
          <GoogleLoginSvg
            onClick={() =>
              HandleSocialLogin(
                googleProvider,
                navigate,
                handleAuthSuccess,
                showAlert
              )
            }
          />
        </div>
        <p className="terms-text">
          By proceeding, you agree to our{" "}
          <Link to="/terms-and-agreement">Terms and conditions</Link> {"   "}and
          our <Link to="/privacy-policy">Privacy policy</Link>
        </p>
      </div>
    </>
  );
};

export default AuthPage;
