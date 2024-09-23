import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { ChangeEvent, useState, FormEvent } from "react";
import { emailRegex } from "../../Utils/Regex";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [changePassword, setChangePassword] = useState({
    email: "",
  });


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailRegex.test(changePassword.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }

    toast.success("Check your email!", {
      duration: 8000,
      position: 'top-left'
    });
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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
            value={changePassword.email}
            onChange={handleInputChange}
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
