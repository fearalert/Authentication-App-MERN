import styles from './Loading.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
