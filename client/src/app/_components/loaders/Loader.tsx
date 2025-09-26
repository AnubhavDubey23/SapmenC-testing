import React from 'react';
import styles from './loader.module.css';

export default function Loader() {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.loader}>
        <div className={`${styles.square_1} ${styles.square}`}></div>
        <div className={`${styles.square_2} ${styles.square}`}></div>
      </div>
    </div>
  );
}
