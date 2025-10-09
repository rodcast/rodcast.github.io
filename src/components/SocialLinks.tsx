import icon from '@/styles/icon.module.css';
import styles from '@/styles/sidebar.module.css';
import localFont from 'next/font/local';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello',
});

interface SocialLinkProps {
  href: string;
  title: string;
  ariaLabel: string;
  iconClass: string;
  platform: string;
}

/** Social link item */
function SocialLink({ href, title, ariaLabel, iconClass, platform }: SocialLinkProps) {
  return (
    <li className={styles.item}>
      <a
        href={href}
        rel="me"
        title={title}
        className={styles.url}
        aria-label={ariaLabel}
      >
        <i className={`${fontello.variable} ${iconClass}`} aria-hidden="true" />
        <span className="sr-only">{platform}</span>
      </a>
    </li>
  );
}

/** Social links list */
export default function SocialLinks() {
  const socialLinks = [
    {
      href: "https://github.com/rodcast",
      title: "Follow me on GitHub",
      ariaLabel: "Visit Rodrigo Castilho's GitHub profile",
      iconClass: icon.github,
      platform: "GitHub",
    },
    {
      href: "https://twitter.com/rodcast",
      title: "Follow me on Twitter",
      ariaLabel: "Visit Rodrigo Castilho's Twitter profile",
      iconClass: icon.twitter,
      platform: "Twitter",
    },
    {
      href: "https://linkedin.com/in/rodcast",
      title: "Follow me on LinkedIn",
      ariaLabel: "Visit Rodrigo Castilho's LinkedIn profile",
      iconClass: icon.linkedin,
      platform: "LinkedIn",
    },
    {
      href: "https://medium.com/@rodcast",
      title: "Follow me on Medium",
      ariaLabel: "Visit Rodrigo Castilho's Medium profile",
      iconClass: icon.medium,
      platform: "Medium",
    },
  ];

  return (
    <ul className={styles.list}>
      {socialLinks.map((link) => (
        <SocialLink
          key={link.platform}
          href={link.href}
          title={link.title}
          ariaLabel={link.ariaLabel}
          iconClass={link.iconClass}
          platform={link.platform}
        />
      ))}
    </ul>
  );
}