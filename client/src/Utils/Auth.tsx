import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default Auth;
