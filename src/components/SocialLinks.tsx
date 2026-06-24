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
function SocialLink({
  href,
  title,
  ariaLabel,
  iconClass,
  platform,
}: SocialLinkProps) {
  return (
    <li className="mr-2 last:mr-0">
      <a
        href={href}
        rel="me"
        title={title}
        className="inline-block h-10 w-10 rounded-full bg-[var(--tertiary-color)] leading-10 text-[var(--secondary-color)] [transition:all_0.2s] hover:rotate-[360deg] hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] focus:rotate-[360deg] focus:bg-[var(--secondary-color)] focus:text-[var(--primary-color)]"
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
      href: 'https://github.com/rodcast',
      title: 'Follow me on GitHub',
      ariaLabel: "Visit Rodrigo Castilho's GitHub profile",
      iconClass: 'icon-github',
      platform: 'GitHub',
    },
    {
      href: 'https://twitter.com/rodcast',
      title: 'Follow me on Twitter',
      ariaLabel: "Visit Rodrigo Castilho's Twitter profile",
      iconClass: 'icon-twitter',
      platform: 'Twitter',
    },
    {
      href: 'https://www.linkedin.com/in/rodcast',
      title: 'Follow me on LinkedIn',
      ariaLabel: "Visit Rodrigo Castilho's LinkedIn profile",
      iconClass: 'icon-linkedin',
      platform: 'LinkedIn',
    },
    {
      href: 'https://medium.com/@rodcast',
      title: 'Follow me on Medium',
      ariaLabel: "Visit Rodrigo Castilho's Medium profile",
      iconClass: 'icon-medium',
      platform: 'Medium',
    },
  ];

  return (
    <ul className="flex items-center justify-center">
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
