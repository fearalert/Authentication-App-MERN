import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { ChangeEvent, useState, FormEvent } from "react";
import { emailRegex } from "../../Utils/Regex";
import toast from "react-hot-toast";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import axios from "axios";
import LoadingSpinner from "../LoadingScreen/LoadingScreen";
import hostname from "../../Constants/Hostname";
import { useAuth } from "../../Utils/AuthContext/useAuth";


interface LoginCredentials {
  email: string;
  password: string;
}

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuthenticated, setRefreshToken } = useAuth(); 

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${hostname}/v1/users/login`, credentials, { withCredentials: true });
      const { accessToken } = response.data;
  
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setAuthenticated(true);
        setRefreshToken(accessToken);
        navigate('/home');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(`Error: ${error.response?.data?.message || "Something went wrong."}`, {
        duration: 4000,
        position: 'top-left'
      });
    }
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!emailRegex.test(loginDetails.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }
  
    if (loginDetails.password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }
  
    setLoading(true);
    await login(loginDetails);
    setLoading(false);
  };
  


  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.formContainer}>
          <h1>Login</h1>
          <div className={styles.inputContainer}>
            <input
              type="email"
              placeholder="Enter your Email..."
              name="email"
              value={loginDetails.email}
              onChange={handleInputChange}
            />
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password..."
                name="password"
                value={loginDetails.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={styles.showHideBtn}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <button type="submit">Login</button>
          </div>

          <Link className={styles.forgotPassword} to={"/forgot-password"}>Forgot Password?</Link>
          
          <div>________________________</div>
          <div className={styles.socialLogin}>
            <button type="button" className={styles.googleBtn}>
              <FaGoogle className={styles.icon} /> Login with Google
            </button>
            <button type="button" className={styles.facebookBtn}>
              <FaFacebookF className={styles.icon} /> Login with Facebook
            </button>
          </div>

          <div className={styles.links}>
            <span>Don't have an account? </span>
            <Link className={styles.redirect} to={"/signup"}>Sign up here</Link>
          </div>
        </div>
      )}
    </form>
  );
}

export default Login;
