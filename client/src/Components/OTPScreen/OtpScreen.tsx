import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './Otp.module.css';
import LoadingSpinner from '../LoadingScreen/LoadingScreen';
import hostname from '../../Constants/Hostname';

function OtpScreen() {
  const [OTP, setOTP] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (OTP.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.", {
        duration: 4000,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${hostname}/v1/users/verify-otp`, { email, OTP });
      toast.success(response.data.message, {
        duration: 4000,
        position: 'top-left',
      });
      navigate('/home');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed.', {
        duration: 4000,
        position: 'top-left',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.formContainer}>
          <h1>OTP Verification</h1>
          <p>Enter your 6-digits OTP received via your email.</p>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="otp"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter your 6-digit OTP"
              maxLength={6}
              required
            />
            <button type="submit">Verify OTP</button>
          </div>
        </div>
      )}
    </form>
  );
}

export default OtpScreen;
