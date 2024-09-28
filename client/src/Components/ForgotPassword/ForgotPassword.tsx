/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { useState, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../LoadingScreen/LoadingScreen";
import hostname from "../../Constants/Hostname";
import { emailRegex } from "../../Utils/Regex";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate email format before submitting
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${hostname}/v1/users/forgot-password`, { email });
      toast.success(response.data.message, {
        duration: 4000,
        position: 'top-left'
      });
      navigate('/reset-password');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong.', {
        duration: 4000,
        position: 'top-left'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h1>Forgot Password?</h1>
          <p>Enter your registered email address below to get the password reset link or OTP.</p>
          <div className={styles.inputContainer}>
            <input
              type="email"
              placeholder="Enter your Email..."
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={!email.trim()}>
              Proceed to Reset
            </button>
          </div>

          <div className={styles.links}>
            <span>Want to Login? </span>
            <Link className={styles.redirect} to={"/"}>Login here</Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
