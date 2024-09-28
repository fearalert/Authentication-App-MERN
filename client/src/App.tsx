import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Otp from "./Components/OTPScreen.tsx/OtpScreen";
import { AuthProvider } from "./Utils/AuthContext";
import { RequireAuth, RequireSignup, RequireForgotPassword } from "./Utils/RequireAuth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={
            <RequireSignup>
              <Otp />
            </RequireSignup>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={
            <RequireForgotPassword>
              <ResetPassword />
            </RequireForgotPassword>
          } />
          <Route path="/home" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route path="*" element={<h1 className="error">404 Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
