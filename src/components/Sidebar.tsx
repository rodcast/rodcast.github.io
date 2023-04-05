import Image from 'next/image';
import localFont from 'next/font/local';
import styles from '@/styles/sidebar.module.css';
import icon from '@/styles/icon.module.css';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello'
});

export default function Sidebar() {
  return (
    <aside className={styles.content} role="complementary">
      <Image src="/rodrigo-castilho-rodcast_photo.jpg"
        width={125}
        height={125}
        alt="Rodrigo Castilho (RODCAST)"
        className={styles.photo}
        itemProp="image"
        sizes="
            (max-width: 768px) 95px,
            (max-width: 1200px) 105px,
            33vw
          "
        quality={100}
        priority
      />
      <h1 className={styles.name} itemProp="name">Rodrigo Castilho <span itemProp="alternateName">(RODCAST)</span></h1>
      <h2 className={styles.description} itemProp="description">
        Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.
      </h2>
      <ul className={styles.list}>
        <li className={styles.item}>
          <a href="https://github.com/rodcast" rel="me" title="Follow me on GitHub" className={styles.url}>
            <i className={`${fontello.variable} ${icon.github}`} />
          </a>
        </li>
        <li className={styles.item}>
          <a href="https://twitter.com/rodcast" rel="me" title="Follow me on Twitter" className={styles.url}>
            <i className={`${fontello.variable} ${icon.twitter}`} />
          </a>
        </li>
        <li className={styles.item}>
          <a href="https://linkedin.com/in/rodcast" rel="me" title="Follow me on Linkedin" className={styles.url}>
            <i className={`${fontello.variable} ${icon.linkedin}`} />
          </a>
        </li>
        <li className={styles.item}>
          <a href="https://medium.com/@rodcast" rel="me" title="Follow me on Medium" className={styles.url}>
            <i className={`${fontello.variable} ${icon.medium}`} />
          </a>
        </li>
      </ul>
    </aside>
  );
}
