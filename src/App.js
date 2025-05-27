import { HashRouter as Router } from "react-router-dom"; // Changed to HashRouter
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import "./index.css";
import RouteWrapper from "./routes/RouteWrapper";

function App() {
  return (
    <>
      <Router>
        <SnackbarProvider>
          <AuthProvider>
            <RouteWrapper />
          </AuthProvider>
        </SnackbarProvider>
      </Router>
    </>
  );
}

export default App;
