import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import SocialLinks from './SocialLinks';

/** Profile sidebar */
export default function Sidebar() {
  return (
    <aside className={styles.content} id="about">
      <Image
        src="/rodrigo-castilho-rodcast_photo.jpg"
        width={120}
        height={120}
        alt="Professional headshot of Rodrigo Castilho, Staff Frontend Software Engineer"
        className={styles.photo}
        itemProp="image"
        priority
      />
      <h2 className={styles.name} itemProp="name">
        Rodrigo Castilho
      </h2>
      <p className={styles.description} itemProp="description">
        Staff Frontend Software Engineer at{' '}
        <a
          href="https://github.com/gympass"
          className={styles.link}
          rel="external noopener"
        >
          Wellhub
        </a>{' '}
        specializing in React, Next.js, JavaScript, TypeScript, AWS, design
        systems, web performance, and SEO.
        <br />
        <br />
        In a committed relationship with code and the gym.
      </p>
      <SocialLinks />
    </aside>
  );
}
