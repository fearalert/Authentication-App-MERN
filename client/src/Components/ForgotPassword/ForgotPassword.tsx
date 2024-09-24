import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/v1/users/forgot-password', { email });
      toast.success(response.data.message);
      // navigate('/otp');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Reset Password</h1>
        <p>Enter your registered email address below to get the password reset link or OTP.</p>
        <div className={styles.inputContainer}>
          <input
            type="email"
            placeholder="Enter your Email..."
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        
          <button type="submit">Proceed</button>
        </div>

        <div className={styles.links}>
          <span>Want to Login? </span>
          <Link className={styles.redirect} to={"/"}>Login here</Link>
        </div>
      </div>
    </form>
  );
}

export default ForgotPassword;
