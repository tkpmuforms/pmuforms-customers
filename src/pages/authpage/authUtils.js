import { auth, signInWithPopup } from "../../firebase/firebase";
import {
  createCustomer,
  sendVerificationLink,
} from "../../services/services";

const isMailNotVerifiedError = (error) => {
  const errorMessage = [
    error?.message,
    error?.error,
    error?.response?.data?.message,
    error?.response?.data?.error,
  ]
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();

  return (
    errorMessage.includes("mail not verified") ||
    errorMessage.includes("email not verified")
  );
};

const resendVerificationIfNeeded = async (error, user, showAlert) => {
  if (!isMailNotVerifiedError(error) || !user?.uid) return false;

  try {
    await sendVerificationLink(user.uid);
    showAlert(
      "success",
      "Your email is not verified. A new verification email has been sent."
    );
  } catch (resendError) {
    console.error("Error resending verification email:", resendError);
    showAlert(
      "error",
      resendError?.message ||
        resendError?.error ||
        "Your email is not verified, and we could not resend the verification email. Please try again."
    );
  }

  return true;
};

export const HandleSocialLogin = async (
  provider,
  _navigate,
  handleAuthSuccess,
  showAlert
) => {
  if (!provider) {
    console.error("Authentication provider is undefined");
    showAlert("error", "Authentication provider is not configured");
    return;
  }

  let user;

  try {
    const result = await signInWithPopup(auth, provider);
    if (!result) throw new Error("Authentication failed. No result received.");

    user = result.user;
    const userToken = await user.getIdToken();
    const businessUri = localStorage.getItem("businessUri");

    localStorage.setItem("userEmail", user.email);

    const payload = businessUri
      ? { accessToken: userToken, artistId: businessUri }
      : { accessToken: userToken, artistId: "" };

    const res = await createCustomer(payload);

    localStorage.setItem("userId", res.data?.customer?.id);
    localStorage.setItem("accessToken", res.data?.access_token);

    // AuthPage handles navigation after isAuthenticated becomes true
    handleAuthSuccess(res?.data?.customer, res.data?.access_token);
  } catch (error) {
    console.error("Social login error:", error);
    if (await resendVerificationIfNeeded(error, user, showAlert)) return;

    showAlert(
      "error",
      error.message ||
        error.response?.data?.error ||
        "Login failed! Try again later."
    );
  }
};

export const SignInSuccessWithAuthResult = async (
  authResult,
  _navigate,
  handleAuthSuccess,
  showAlert
) => {
  const user = authResult.user;
  const userToken = await user.getIdToken();
  const businessUri = localStorage.getItem("businessUri");

  try {
    localStorage.setItem("userEmail", user.email);

    const payload = businessUri
      ? { accessToken: userToken, artistId: businessUri }
      : { accessToken: userToken, artistId: "" };

    const res = await createCustomer(payload);

    localStorage.setItem("userId", res.data?.customer?.id);
    localStorage.setItem("accessToken", res.data?.access_token);

    // AuthPage handles navigation after isAuthenticated becomes true
    handleAuthSuccess(res?.data?.customer, res.data?.access_token);
  } catch (error) {
    console.error("Error during login callback:", error);

    if (await resendVerificationIfNeeded(error, user, showAlert)) return;

    showAlert(
      "error",
      error?.message ||
        error?.response?.data?.error ||
        "Login failed! Try again later."
    );
  }
};
