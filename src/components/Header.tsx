import styles from '@/styles/header.module.css';

export default function Header() {
  return (
    <header className={styles.content} role="banner">
      <span className={styles.logo}>RODCAST</span>
    </header>
  );
}
