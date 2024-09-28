import { useEffect } from 'react';
import { useAuth } from '../../Utils/AuthContext/useAuth';

const Home = () => {
  const { setAuthenticated, setRefreshToken } = useAuth();

  const isTokenValid = (token: string | null): boolean => {
    if (!token || !token.includes('.')) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log("Error----", error)
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setAuthenticated(true);
      setRefreshToken(token);
    }
  }, [setAuthenticated, setRefreshToken]);

  return (
    <div>
      Home
    </div>
  );
};

export default Home;
