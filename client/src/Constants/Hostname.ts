// const hostname = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const hostname = 'http://localhost:4000';

if (!hostname) {
  throw new Error('Environment variable REACT_APP_API_URL is not defined');
}

export default hostname;