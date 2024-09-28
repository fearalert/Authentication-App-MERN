import { useEffect } from 'react';
import { useAuth } from '../../Utils/AuthContext/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { setAuthenticated, refreshToken } = useAuth();
  const navigate = useNavigate();

  const isTokenValid = (token: string | null): boolean => {
    if (!token || !token.includes('.')) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      console.log("Token is valid:", token);
    } else {
      console.log("Token is invalid or not present. Redirecting to login.");
      handleLogout();
      navigate('/'); 
        }
  });

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Your token is: {refreshToken}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
