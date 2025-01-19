import { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
  const defaultContext = useContext(AuthContext);
  return defaultContext;
};

export default useAuth;
