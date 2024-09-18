
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/authpage/AuthPage';
import './utils/toast/toast.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
         <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage/>}/>
      </Routes>

    </Router>
    
    </>
  );
}

export default App;
