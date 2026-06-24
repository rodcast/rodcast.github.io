const navLinkClass =
  'rounded-md px-8 py-4 text-[var(--secondary-color)] no-underline [transition:color_0.2s_ease,background-color_0.2s_ease] hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)]';

/** Navigation component */
function Navigation() {
  return (
    <nav
      className="mr-auto max-md:ml-0 max-md:w-full"
      aria-label="Main navigation"
    >
      <ul className="m-0 flex list-none gap-8 p-0 max-md:w-full max-md:justify-center">
        <li>
          <a href="#about" className={navLinkClass}>
            About
          </a>
        </li>
        <li>
          <a href="#github-projects" className={navLinkClass}>
            Projects
          </a>
        </li>
        <li>
          <a href="#medium-articles" className={navLinkClass}>
            Articles
          </a>
        </li>
      </ul>
    </nav>
  );
}

/** Site header */
export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-8 overflow-hidden max-md:flex-col max-md:items-start">
      <h1 className="inline-block bg-[linear-gradient(to_right,var(--secondary-color),var(--contrast-color))] bg-clip-text text-[400%] font-semibold leading-[100%] tracking-[-0.2rem] text-transparent [-webkit-background-clip:text] [transition:all_0.2s] hover:animate-fade-bg hover:[backface-visibility:hidden] hover:[transform:rotateX(360deg)] max-md:text-[340%]">
        <span className="hidden">Rodrigo Castilho</span>
        RODCAST
      </h1>
      <Navigation />
    </header>
  );
}
