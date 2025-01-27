import useAuth from "../../context/useAuth";
import { auth, signInWithPopup } from "../../firebase/firebase";
import { createCustomer } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";

export const HandleSocialLogin = async (
  provider,
  navigate,
  handleAuthSuccess
) => {
  if (!provider) {
    console.error("Authentication provider is undefined");
    Toast("error", "Authentication provider is not configured");
    return;
  }
  try {
    const result = await signInWithPopup(auth, provider);
    if (!result) {
      throw new Error("Authentication failed. No result received.");
    }
    const user = result.user;

    const userToken = await user.getIdToken();
    const artistId = localStorage.getItem("artistId");
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.displayName);

    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
    }).then((res) => {
      localStorage.setItem("userId", res.data?.customer?.id);
      localStorage.setItem("accessToken", res.data?.access_token);
      handleAuthSuccess(res?.data?.customer, res.data?.access_token);

      Toast("success", "Login successful");
      navigate("/dashboard");
    });
  } catch (error) {
    console.error("Social login error:", error);

    Toast("error", `Login failed: ${error.message}`);
  }
};

export const SignInSuccessWithAuthResult = async (
  authResult,
  navigate,
  handleAuthSuccess
) => {
  const user = authResult.user;
  const userToken = await user.getIdToken();
  const artistId = localStorage.getItem("artistId");
  try {
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.displayName);
    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
    }).then((res) => {
      localStorage.setItem("userId", res.data?.customer?.id);
      localStorage.setItem("accessToken", res.data?.access_token);
      handleAuthSuccess(res?.data?.customer, res.data?.access_token);

      Toast("success", "Login successful");
      navigate("/dashboard");
    });

    Toast("success", "Login successful");
    navigate("/dashboard");
  } catch (error) {
    console.error("Error during login callback:", error);

    Toast("error", `Login failed: ${error.message}`);
  }
};
