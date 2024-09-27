import { useState, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import hostname from '../../Constants/Hostname';

function ResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    verificationToken: '',
    newPassword: ''
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${hostname}/v1/users/reset-password`, formData);
      toast.success(response.data.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
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
    </form>
  );
}

export default ResetPassword;
