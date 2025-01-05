import { auth, signInWithPopup } from "../../firebase/firebase";
import { createCustomer } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";

export const handleSocialLogin = async (provider, navigate) => {
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
    console.log("User:", user);
    const userToken = await user.getIdToken();
    const artistId = localStorage.getItem("artistId");
    localStorage.setItem("userEmail", user.email);

    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
    }).then((res) => {
      console.log(res.data);
      localStorage.setItem("userId", res.data?.customer?.id);
      localStorage.setItem("accessToken", res.data?.access_token);
      console.log("Social login successful:", user);
      Toast("success", "Login successful");
      navigate("/dashboard");
    });
  } catch (error) {
    console.error("Social login error:", error);

    Toast("error", `Login failed: ${error.message}`);
  }
};

export const signInSuccessWithAuthResult = async (authResult, navigate) => {
  const user = authResult.user;
  const userToken = await user.getIdToken();
  const artistId = localStorage.getItem("artistId");
  try {
    localStorage.setItem("userEmail", user.email);
    await createCustomer({
      accessToken: userToken,
      artistId: artistId,
    }).then((res) => {
      console.log(res);
      localStorage.setItem("userId", res.data?.customer?.id);
      localStorage.setItem("accessToken", res.data?.access_token);
      console.log("Social login successful:", user);
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
