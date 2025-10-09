import icon from '@/styles/icon.module.css';
import styles from '@/styles/sidebar.module.css';
import localFont from 'next/font/local';
import Image from 'next/image';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello',
});

export default function Sidebar() {
  return (
    <aside className={styles.content} role="complementary" id="about">
      <Image
        src="/rodrigo-castilho-rodcast_photo.jpg"
        width={125}
        height={125}
        alt="Professional headshot of Rodrigo Castilho, Staff Frontend Engineer"
        className={styles.photo}
        itemProp="image"
        sizes="
            (max-width: 768px) 95px,
            (max-width: 1200px) 105px,
            33vw
          "
        quality={100}
        loading="lazy"
      />
      <h2 className={styles.name} itemProp="name">
        Rodrigo Castilho <span itemProp="alternateName">(RODCAST)</span>
      </h2>
      <h3 className={styles.description} itemProp="description">
        Staff Frontend Engineer and ex-@Yahoo in a serious relationship with
        programming languages and the gym.
      </h3>
      <ul className={styles.list}>
        <li className={styles.item}>
          <a
            href="https://github.com/rodcast"
            rel="me"
            title="Follow me on GitHub"
            className={styles.url}
            aria-label="Visit Rodrigo Castilho's GitHub profile"
          >
            <i className={`${fontello.variable} ${icon.github}`} aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </a>
        </li>
        <li className={styles.item}>
          <a
            href="https://twitter.com/rodcast"
            rel="me"
            title="Follow me on Twitter"
            className={styles.url}
            aria-label="Visit Rodrigo Castilho's Twitter profile"
          >
            <i className={`${fontello.variable} ${icon.twitter}`} aria-hidden="true" />
            <span className="sr-only">Twitter</span>
          </a>
        </li>
        <li className={styles.item}>
          <a
            href="https://linkedin.com/in/rodcast"
            rel="me"
            title="Follow me on LinkedIn"
            className={styles.url}
            aria-label="Visit Rodrigo Castilho's LinkedIn profile"
          >
            <i className={`${fontello.variable} ${icon.linkedin}`} aria-hidden="true" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </li>
        <li className={styles.item}>
          <a
            href="https://medium.com/@rodcast"
            rel="me"
            title="Follow me on Medium"
            className={styles.url}
            aria-label="Visit Rodrigo Castilho's Medium profile"
          >
            <i className={`${fontello.variable} ${icon.medium}`} aria-hidden="true" />
            <span className="sr-only">Medium</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
