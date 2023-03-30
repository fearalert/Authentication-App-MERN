import { Link } from "react-router-dom";
import styles from "./Signup.module.css";
import { ChangeEvent, useState, FormEvent } from "react";
import { emailRegex, passwordRegex } from "../../Utils/Regex";
import toast from "react-hot-toast";

function Signup() {
  const [userDetails, setuserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userDetails.username) {
      toast.error("Please enter a valid username.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }

    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      toast.error("Password must be at least 8 characters long and contain at least one uppercase letter and one special case letter.", {
        duration: 8000,
        position: 'top-left'
      });
      return;
    }

    toast.success("Form Submitted Successfully.", {
      duration: 8000,
      position: 'top-left'
    });
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setuserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Sign up</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter your username..."
            name="username"
            value={userDetails.username}
            onChange={handleInputChange}
          />
          <input
            type="email"
            placeholder="Enter your Email..."
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
          
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password..."
              name="password"
              value={userDetails.password}
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

          <button type="submit">Sign up</button>
        </div>
        <div className={styles.links}>
          <span>Already have an account? </span>
          <Link className={styles.redirect} to={"/"}>Login here</Link>
        </div>
      </div>
    </form>
  );
}

export default Signup;
