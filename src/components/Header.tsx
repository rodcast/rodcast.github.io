import styles from '@/styles/header.module.css';

/** Navigation component */
function Navigation() {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <ul className={styles.navList}>
        <li><a href="#about" className={styles.navLink}>About</a></li>
        <li><a href="#github-projects" className={styles.navLink}>Projects</a></li>
        <li><a href="#medium-articles" className={styles.navLink}>Articles</a></li>
      </ul>
    </nav>
  );
}

/** Site header */
export default function Header() {
  return (
    <header className={styles.content} role="banner">
      <h1 className={styles.logo}>
        <span>Rodrigo Castilho</span>
        RODCAST
      </h1>
      <Navigation />
    </header>
  );
}
