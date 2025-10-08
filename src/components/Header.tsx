import styles from '@/styles/header.module.css';

export default function Header() {
  return (
    <header className={styles.content} role="banner">
      <h1 className={styles.logo}>
        <span>Rodrigo Castilho</span>
        RODCAST
      </h1>
    </header>
  );
}
