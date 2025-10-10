import styles from '@/styles/footer.module.css';

/** Site footer */
export default function Footer() {
  return (
    <footer className={styles.content} role="contentinfo">
      <div className={styles.links}>
        <a href="/feed.xml" className={styles.link} title="RSS Feed">RSS Feed</a>
        <a href="/sitemap.xml" className={styles.link} title="Sitemap">Sitemap</a>
        <a href="https://github.com/rodcast/rodcast.github.io" className={styles.link} rel="external" title="My GitHub">Source Code</a>
      </div>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} Rodrigo Castilho. Open source on GitHub.
      </p>
    </footer>
  );
}