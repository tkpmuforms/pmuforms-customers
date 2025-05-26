import AppWrapper from "./AppWrapper";
import "./index.css";
import { HashRouter as Router } from "react-router-dom"; // Changed to HashRouter
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";

function App() {
  return (
    <>
      <Router>
        <SnackbarProvider>
          <AuthProvider>
            <AppWrapper />
          </AuthProvider>
        </SnackbarProvider>
      </Router>
    </>
  );
}

export default App;
