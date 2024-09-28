import { useState, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import hostname from '../../Constants/Hostname';
import { useNavigate } from 'react-router-dom';
import styles from './Reset.module.css';
import LoadingSpinner from '../LoadingScreen/LoadingScreen';

function ResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    verificationToken: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${hostname}/v1/users/reset-password`, formData);
      toast.success(response.data.message);
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
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
          <h1>Reset Password</h1>
          <p>Enter your registered email address, verification code received via email and the new password.</p>
            <div className={styles.inputContainer}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            required
          />
          <input
            type="text"
            value={formData.verificationToken}
            onChange={(e) => setFormData({ ...formData, verificationToken: e.target.value })}
            placeholder="Enter your verification token"
            required
          />
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Enter your new password"
            required
          />
          <button type="submit">Reset Password</button>
        </div>
        </div>
      )}
    </form>
  );
}

export default ResetPassword;
