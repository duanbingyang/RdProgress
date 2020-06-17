import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>哈三联 开放平台</span>
      <br />
      <span className={styles.copyright}>© 2019-现在 Medisan Development & DMD</span>
    </p>
  );
}
