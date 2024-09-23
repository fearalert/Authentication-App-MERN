const hostname = "http://localhost:4000";

if (!hostname) {
  throw new Error('Environment variable REACT_APP_API_URL is not defined');
}

export {hostname};
