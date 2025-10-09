import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import SocialLinks from './SocialLinks';

/** Profile sidebar */
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
      <SocialLinks />
    </aside>
  );
}
