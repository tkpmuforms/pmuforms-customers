import { auth } from "../../firebase/firebase";
import { createCustomer } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";

export const handleSocialLogin = async (provider, navigate, log) => {
  try {
    const result = await auth.signInWithPopup(provider);
    if (!result) {
      throw new Error("Authentication failed. No result received.");
    }
    const user = result.user;
    const userToken = await user.getIdToken();
    const artistId = localStorage.getItem("artistId");

    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("idToken", userToken);

    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
      email: user.email,
      name: user.displayName,
    });

    console.log("Social login successful:", user);
    Toast("success", "Login successful");
    navigate("/dashboard");
  } catch (error) {
    console.error("Social login error:", error);
    log("Social login error", error.message);
    Toast("error", `Login failed: ${error.message}`);
  }
};

export const signInSuccessWithAuthResult = async (
  authResult,
  navigate,
  log
) => {
  const user = authResult.user;
  const userToken = await user.getIdToken();
  const artistId = localStorage.getItem("artistId");
  try {
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("idToken", userToken);
    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
      email: user.email,
      name: user.displayName,
    });

    Toast("success", "Login successful");
    navigate("/dashboard");
  } catch (error) {
    console.error("Error during login callback:", error);
    log("Login callback error", error.message);
    Toast("error", `Login failed: ${error.message}`);
  }
};
