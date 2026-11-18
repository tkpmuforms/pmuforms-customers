import { signInWithPopup } from "../../firebase/firebase";
import { createCustomer, sendVerificationLink } from "../../services/services";
import { HandleSocialLogin, SignInSuccessWithAuthResult } from "./authUtils";

jest.mock("../../firebase/firebase", () => ({
  auth: {},
  signInWithPopup: jest.fn(),
}));
jest.mock("../../services/services", () => ({
  createCustomer: jest.fn(),
  sendVerificationLink: jest.fn(),
}));

let user;
let handleAuthSuccess;
let showAlert;

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
  jest.spyOn(console, "error").mockImplementation(() => {});
  user = {
    uid: "user-id",
    email: "user@example.com",
    getIdToken: jest.fn().mockResolvedValue("firebase-token"),
  };
  handleAuthSuccess = jest.fn();
  showAlert = jest.fn();
  sendVerificationLink.mockResolvedValue({ data: {} });
});

afterEach(() => jest.restoreAllMocks());

const login = () =>
  SignInSuccessWithAuthResult({ user }, jest.fn(), handleAuthSuccess, showAlert);

test.each([
  { message: "Mail not verified" },
  { message: "Email is not verified" },
  { message: "Email has not been verified" },
  { code: "EMAIL_NOT_VERIFIED" },
  { error: "Unverified email" },
  { response: { data: { error: "Email verification required" } } },
])("handles the backend verification response %j", async (error) => {
  createCustomer.mockRejectedValue(error);
  await login();
  expect(sendVerificationLink).toHaveBeenCalledWith(user.uid);
  expect(showAlert).toHaveBeenCalledWith(
    "success",
    expect.stringContaining("Check your inbox")
  );
  expect(showAlert).toHaveBeenCalledTimes(1);
  expect(handleAuthSuccess).not.toHaveBeenCalled();
  expect(localStorage.getItem("accessToken")).toBeNull();
});

test("uses Firebase's unverified state when the API returns a generic error", async () => {
  user.emailVerified = false;
  createCustomer.mockRejectedValue({ message: "Something went wrong!" });
  await login();
  expect(sendVerificationLink).toHaveBeenCalledWith(user.uid);
  expect(showAlert).toHaveBeenCalledWith(
    "success",
    expect.stringContaining("Check your inbox")
  );
  expect(handleAuthSuccess).not.toHaveBeenCalled();
});

test("keeps verification instructions when resending fails without claiming a link was sent", async () => {
  createCustomer.mockRejectedValue({ message: "Email not verified" });
  sendVerificationLink.mockRejectedValue({ message: "Something went wrong!" });
  await login();
  expect(showAlert).toHaveBeenCalledWith(
    "warning",
    expect.stringContaining("We could not send a new link")
  );
  expect(showAlert).toHaveBeenCalledTimes(1);
  expect(handleAuthSuccess).not.toHaveBeenCalled();
});

test("preserves unrelated errors for a verified account", async () => {
  user.emailVerified = true;
  createCustomer.mockRejectedValue({ message: "Service unavailable" });
  await login();
  expect(sendVerificationLink).not.toHaveBeenCalled();
  expect(showAlert).toHaveBeenCalledWith("error", "Service unavailable");
});

test("authenticates normally when the backend accepts the login", async () => {
  const customer = { id: "customer-id" };
  createCustomer.mockResolvedValue({
    data: { customer, access_token: "session-token" },
  });
  await login();
  expect(handleAuthSuccess).toHaveBeenCalledWith(customer, "session-token");
  expect(localStorage.getItem("accessToken")).toBe("session-token");
  expect(sendVerificationLink).not.toHaveBeenCalled();
  expect(showAlert).not.toHaveBeenCalled();
});

test("also handles unverified accounts during social login", async () => {
  user.emailVerified = false;
  signInWithPopup.mockResolvedValue({ user });
  createCustomer.mockRejectedValue({ message: "Something went wrong!" });
  await HandleSocialLogin({}, jest.fn(), handleAuthSuccess, showAlert);
  expect(sendVerificationLink).toHaveBeenCalledWith(user.uid);
  expect(showAlert).toHaveBeenCalledWith(
    "success",
    expect.stringContaining("Check your inbox")
  );
  expect(handleAuthSuccess).not.toHaveBeenCalled();
});
