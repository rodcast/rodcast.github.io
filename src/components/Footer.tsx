const linkClass =
  'text-[var(--secondary-color)] underline mx-8 text-sm [transition:color_0.2s_ease] hover:no-underline';

/** Site footer */
export default function Footer() {
  return (
    <footer className="mt-16 px-8 py-16 text-center" role="contentinfo">
      <div className="mb-8">
        <a href="/feed.xml" className={linkClass} title="RSS Feed">
          RSS Feed
        </a>
        <a href="/sitemap.xml" className={linkClass} title="Sitemap">
          Sitemap
        </a>
        <a
          href="https://github.com/rodcast/rodcast.github.io"
          className={linkClass}
          rel="external"
          title="My GitHub"
        >
          Source Code
        </a>
      </div>
      <p className="m-0 text-sm">
        &copy; {new Date().getFullYear()} Rodrigo Castilho. Open source on
        GitHub.
      </p>
    </footer>
  );
}
